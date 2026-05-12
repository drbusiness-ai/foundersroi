/**
 * /api/stripe-webhook — Vercel serverless function
 *
 * Receives Stripe webhook events. The critical event is:
 *   checkout.session.completed → generate PDF + send email + save order
 *
 * Flow:
 *   1. Verify Stripe webhook signature (prevent spoofing)
 *   2. Extract metadata from the completed Checkout Session
 *   3. Call GPT-4o to generate the AI narrative
 *   4. Render the PDF report
 *   5. Upload PDF to storage (PocketBase / Cloud)
 *   6. Send email via Resend with PDF download link
 *   7. Save order record to PocketBase
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY=sk_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   OPENAI_API_KEY=sk-...
 *   RESEND_API_KEY=re_...
 *   POCKETBASE_URL=https://...
 *   POCKETBASE_ADMIN_EMAIL=...
 *   POCKETBASE_ADMIN_PASSWORD=...
 */

// ══════════════════════════════════════════════════════════════
// IMPORTANT: This webhook integrates with PocketBase, OpenAI,
// and Resend. Until you configure these env vars, the webhook
// will log what it received but skip the processing steps.
// ══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Verify Stripe Signature ─────────────────────────────
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — cannot verify signature');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let Stripe;
  try {
    const stripeModule = await import('stripe');
    Stripe = stripeModule.default;
  } catch (err) {
    console.error('[stripe-webhook] Failed to load stripe module:', err);
    return res.status(500).json({ error: 'Service unavailable' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    // Use the raw body buffer for signature verification
    // Vercel provides req.body as parsed JSON, but Stripe needs the raw body.
    // For Vercel, configure the function to not auto-parse the body:
    //   export const config = { api: { bodyParser: false } };
    const rawBody = req.rawBody || JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  console.log(`[stripe-webhook] Received event: ${event.type}`);

  // ── Handle Checkout Session Completed ───────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log(`[stripe-webhook] Payment completed: ${session.id}`);
    console.log(`[stripe-webhook] Customer: ${session.customer_details?.email}`);
    console.log(`[stripe-webhook] Amount: ${session.amount_total / 100} ${session.currency?.toUpperCase()}`);
    console.log(`[stripe-webhook] Tier: ${session.metadata?.tier || 'unknown'}`);

    try {
      await processCompletedCheckout(session);
      console.log(`[stripe-webhook] Order processed successfully: ${session.id}`);
    } catch (err) {
      console.error(`[stripe-webhook] Order processing failed for ${session.id}:`, err);
      // Still return 200 to Stripe (prevents retries), but log the error for manual resolution
    }
  }

  // ── Return 200 to acknowledge receipt ───────────────────
  return res.status(200).json({ received: true, type: event.type });
}

/**
 * Process a completed checkout: generate report, deliver email, save order.
 * Each step is independent — failures in one don't block others.
 */
async function processCompletedCheckout(session) {
  const email = session.customer_details?.email || session.customer_email;
  const metadata = session.metadata || {};
  const tier = metadata.tier || 'l1';
  const fsiScore = parseInt(metadata.fsiScore, 10) || null;
  const survivalBand = metadata.survivalBand || '';

  // Decompress form data from compact metadata
  let formData = {};
  try {
    if (metadata.formDataCompact) {
      const compact = JSON.parse(metadata.formDataCompact);
      formData = {
        companyName: compact.cn || '',
        stage: compact.st || '',
        businessModel: compact.bm || '',
        monthlyRevenue: compact.mr ?? 0,
        monthlyBurn: compact.mb ?? 0,
        cashInBank: compact.cb ?? 0,
        cac: compact.ca ?? 0,
        ltv: compact.lt ?? 0,
        monthlyChurn: compact.ch ?? 0,
        teamSize: compact.ts ?? 0,
      };
    }
  } catch (err) {
    console.warn('[stripe-webhook] Failed to parse formDataCompact:', err.message);
  }

  // Map tier to label
  const TIER_LABELS = {
    l1: 'AI Survival Scan',
    l2: 'Founder Truth Audit',
    l3: 'Financial Triage',
    l4: 'Recovery Sprint',
  };

  // ── Save order to PocketBase ─────────────────────────────
  let orderId = null;
  try {
    orderId = await saveOrderToPocketBase({
      stripeSessionId: session.id,
      stripeCustomerId: session.customer || null,
      email,
      tier,
      tierLabel: TIER_LABELS[tier] || tier,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || 'usd',
      status: 'paid',
      fsiScore,
      survivalBand,
      formData,
      metadata,
    });
    console.log(`[stripe-webhook] Order saved to PocketBase: ${orderId}`);
  } catch (err) {
    console.error('[stripe-webhook] Failed to save order to PocketBase:', err.message);
  }

  // ── Generate AI Narrative ─────────────────────────────────
  let reportContent = null;
  try {
    reportContent = await generateReportNarrative(fsiScore, survivalBand, formData);
    console.log('[stripe-webhook] AI narrative generated');
  } catch (err) {
    console.error('[stripe-webhook] Failed to generate AI narrative:', err.message);
    // Continue — we'll use template fallback in PDF generation
  }

  // ── Generate PDF ──────────────────────────────────────────
  let pdfUrl = null;
  try {
    pdfUrl = await generateAndUploadPdf(fsiScore, survivalBand, reportContent, formData, session.id);
    console.log(`[stripe-webhook] PDF generated: ${pdfUrl}`);
  } catch (err) {
    console.error('[stripe-webhook] Failed to generate PDF:', err.message);
  }

  // ── Send Email via Resend ─────────────────────────────────
  if (email && (pdfUrl || reportContent)) {
    try {
      await sendReportEmailViaResend({
        to: email,
        tier: TIER_LABELS[tier] || tier,
        score: fsiScore,
        band: survivalBand,
        companyName: formData.companyName || 'Your Startup',
        pdfUrl,
        orderId,
      });
      console.log(`[stripe-webhook] Report email sent to ${email}`);
    } catch (err) {
      console.error('[stripe-webhook] Failed to send email:', err.message);
    }
  } else {
    console.warn('[stripe-webhook] Skipping email — no recipient or no content');
  }

  // ── Update order with delivery status ─────────────────────
  if (orderId && pdfUrl) {
    try {
      await updateOrderDelivery(orderId, pdfUrl, reportContent);
    } catch (err) {
      console.error('[stripe-webhook] Failed to update order delivery:', err.message);
    }
  }

  return { orderId, pdfUrl };
}

// ── PocketBase Integration ──────────────────────────────────

async function authenticatePocketBase() {
  const pbUrl = process.env.POCKETBASE_URL;
  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!pbUrl || !adminEmail || !adminPassword) {
    throw new Error('PocketBase not configured (missing env vars)');
  }

  const authResponse = await fetch(`${pbUrl}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: adminEmail, password: adminPassword }),
  });

  if (!authResponse.ok) {
    throw new Error(`PocketBase auth failed: ${authResponse.status}`);
  }

  const authData = await authResponse.json();
  return { pbUrl, token: authData.token };
}

async function saveOrderToPocketBase(orderData) {
  const { pbUrl, token } = await authenticatePocketBase();

  const response = await fetch(`${pbUrl}/api/collections/orders/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      stripe_session_id: orderData.stripeSessionId,
      stripe_customer_id: orderData.stripeCustomerId,
      email: orderData.email,
      tier: orderData.tier,
      amount: orderData.amount,
      currency: orderData.currency,
      status: orderData.status,
      fsi_score: orderData.fsiScore,
      survival_band: orderData.survivalBand,
      form_data: JSON.stringify(orderData.formData),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PocketBase save failed: ${response.status} — ${body}`);
  }

  const record = await response.json();
  return record.id;
}

async function updateOrderDelivery(orderId, pdfUrl, narrativeJson) {
  const { pbUrl, token } = await authenticatePocketBase();

  const response = await fetch(`${pbUrl}/api/collections/orders/records/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      pdf_url: pdfUrl,
      narrative_json: narrativeJson ? JSON.stringify(narrativeJson) : null,
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PocketBase update failed: ${response.status} — ${body}`);
  }
}

// ── AI Narrative Generation ─────────────────────────────────

async function generateReportNarrative(fsiScore, survivalBand, formData) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('[stripe-webhook] No OPENAI_API_KEY — skipping AI narrative');
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a startup financial diagnostician. Output ONLY valid JSON matching the exact schema provided. Be direct, data-backed, and actionable.',
        },
        {
          role: 'user',
          content: buildNarrativePrompt(fsiScore, survivalBand, formData),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return content ? JSON.parse(content) : null;
}

function buildNarrativePrompt(score, band, formData) {
  return `Analyze this startup and produce a JSON report:

COMPANY: ${formData.companyName || 'the startup'}
STAGE: ${formData.stage || 'Not specified'}
BUSINESS MODEL: ${formData.businessModel || 'Not specified'}
FSI SURVIVAL SCORE: ${score ?? 'N/A'}/100
BAND: ${band || 'N/A'}
REVENUE: $${formData.monthlyRevenue ?? 0}/mo
BURN: $${formData.monthlyBurn ?? 0}/mo
CASH: $${formData.cashInBank ?? 0}
CAC: $${formData.cac ?? 0}
LTV: $${formData.ltv ?? 0}
CHURN: ${formData.monthlyChurn ?? 0}%/mo
TEAM: ${formData.teamSize ?? 0}

Return exactly this JSON structure:
{
  "survivalStory": "2-3 sentence narrative",
  "top3Leaks": [{"title": "...", "diagnosis": "...", "impact": "..."}],
  "top3QuickWins": [{"action": "...", "expectedOutcome": "...", "timeline": "0-30 Days"}],
  "thirtyDayPlan": [{"week": "Week 1", "focus": "...", "actions": ["...", "..."]}],
  "sixtyNinetyDayPlan": [{"milestone": "Month 2 — ...", "actions": ["...", "..."]}],
  "investorPerception": "2-3 sentences from a VC's perspective"
}`;
}

// ── PDF Generation ──────────────────────────────────────────

async function generateAndUploadPdf(fsiScore, survivalBand, reportContent, formData, sessionId) {
  // PDF generation is client-side in this architecture (@react-pdf/renderer).
  // In a serverless function, we'd need a different approach:
  //   Option A: Use a PDF generation API (e.g., pdforge, docraptor)
  //   Option B: Use Puppeteer in a longer-running function
  //   Option C: Generate on the client after checkout redirect and upload to storage
  //
  // For Phase 1, we use Option C: the success page triggers PDF generation
  // client-side and uploads to PocketBase. The webhook saves the order and
  // sends a "your report is being generated" email. The actual PDF link is
  // set when the client-side generation completes.
  //
  // This function serves as the placeholder — implement based on chosen strategy.

  console.log(`[stripe-webhook] PDF generation deferred for session ${sessionId}`);
  console.log(`[stripe-webhook] Score: ${fsiScore}, Band: ${survivalBand}`);

  // Return null to indicate PDF will be generated client-side
  return null;
}

// ── Email via Resend ────────────────────────────────────────

async function sendReportEmailViaResend({ to, tier, score, band, companyName, pdfUrl, orderId }) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('[stripe-webhook] No RESEND_API_KEY — skipping email delivery');
    return;
  }

  const hasAttachment = pdfUrl && pdfUrl.startsWith('http');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'FoundersROI <reports@foundersroi.com>',
      to: [to],
      subject: hasAttachment
        ? `Your ${tier} Report — Survival Score: ${score}/100`
        : `Payment Confirmed — ${tier} Report`,
      html: buildEmailHtml({ tier, score, band, companyName, pdfUrl, orderId, hasAttachment }),
      // If PDF is available as a URL, attach it
      ...(hasAttachment ? {
        attachments: [
          {
            filename: `FoundersROI-${companyName.replace(/\s+/g, '-')}-Report.pdf`,
            path: pdfUrl,
          },
        ],
      } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error: ${response.status} — ${body}`);
  }
}

function buildEmailHtml({ tier, score, band, companyName, pdfUrl, orderId, hasAttachment }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">FoundersROI</h1>
    <p style="color: #6b7280; margin: 4px 0 0;">The AI Startup Truth Engine</p>
  </div>

  <div style="background: linear-gradient(135deg, #7C3AED, #A78BFA); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 8px;">YOUR SURVIVAL SCORE</p>
    <p style="color: #fff; font-size: 48px; font-weight: bold; margin: 0;">${score ?? '?'}/100</p>
    <p style="color: rgba(255,255,255,0.95); font-size: 18px; margin: 8px 0 0;">${band || ''}</p>
  </div>

  <h2 style="color: #1a1a2e;">${hasAttachment ? 'Your Report is Ready' : 'Payment Confirmed'}</h2>

  <p>Hi${companyName ? ` ${companyName}` : ''},</p>

  <p>Your <strong>${tier}</strong> order is confirmed.${hasAttachment ? ' Your Survival Score Report is attached to this email.' : ' Your report will be ready shortly.'}</p>

  ${hasAttachment && pdfUrl ? `
  <div style="text-align: center; margin: 24px 0;">
    <a href="${pdfUrl}" style="display: inline-block; background-color: #7C3AED; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Download Your Report</a>
  </div>
  ` : `
  <p style="color: #6b7280;">You'll receive another email with your complete report within a few minutes.</p>
  `}

  <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px;">
    <p style="color: #9ca3af; font-size: 12px;">Order #${orderId || 'N/A'} • ${tier}</p>
    <p style="color: #9ca3af; font-size: 12px;">FoundersROI — The AI Startup Truth Engine</p>
  </div>
</body>
</html>`;
}

// Vercel body parser config: we need raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
