/**
 * /api/send-report-email — Vercel serverless function
 *
 * Triggers an email delivery via Resend. Used for:
 *   1. Manual report delivery (admin resend)
 *   2. Client-side triggered email after PDF generation completes
 *   3. Retry mechanism for failed deliveries
 *
 * POST body:
 *   to: string             — recipient email address
 *   pdfUrl: string         — publicly accessible PDF URL
 *   orderData: object      — order context for email personalization
 *   orderId: string        — PocketBase order record ID (for resends)
 *   resend: boolean        — true if this is a retry
 *
 * Required env vars:
 *   RESEND_API_KEY=re_...
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('[send-report-email] RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { to, pdfUrl, orderData = {}, orderId, resend } = req.body;

    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return res.status(400).json({ error: 'Valid recipient email is required' });
    }

    const tier = orderData.tierLabel || orderData.tier || 'Report';
    const score = orderData.score ?? '?';
    const band = orderData.band || '';
    const companyName = orderData.companyName || '';

    const subject = resend
      ? `[Resend] Your FoundersROI ${tier} Report`
      : `Your FoundersROI ${tier} Report — Survival Score: ${score}/100`;

    // Build email HTML
    const html = buildEmailHtml({
      tier,
      score,
      band,
      companyName,
      pdfUrl,
      orderId: orderId || orderData.orderId || '',
      isResend: !!resend,
    });

    // Prepare attachments if PDF URL is available
    const attachments = [];
    if (pdfUrl && pdfUrl.startsWith('http')) {
      attachments.push({
        filename: `FoundersROI${companyName ? `-${companyName.replace(/\s+/g, '-')}` : ''}-Survival-Report.pdf`,
        path: pdfUrl,
      });
    }

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'FoundersROI <reports@foundersroi.com>',
        to: [to],
        subject,
        html,
        ...(attachments.length > 0 ? { attachments } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[send-report-email] Resend API error: ${response.status} — ${errorBody}`);
      return res.status(502).json({
        error: 'Failed to send email',
        details: `Resend responded with ${response.status}`,
      });
    }

    const result = await response.json();
    console.log(`[send-report-email] Email sent to ${to}: ${result.id}`);

    // Update PocketBase order record if we have an orderId
    if (orderId) {
      try {
        await updateOrderEmailSent(orderId);
      } catch (err) {
        console.warn('[send-report-email] Failed to update order record:', err.message);
        // Non-fatal — email was sent successfully
      }
    }

    return res.status(200).json({
      success: true,
      messageId: result.id,
      sentTo: to,
    });
  } catch (err) {
    console.error('[send-report-email] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function buildEmailHtml({ tier, score, band, companyName, pdfUrl, orderId, isResend }) {
  const hasPdf = pdfUrl && pdfUrl.startsWith('http');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e; background-color: #f9fafb;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">FoundersROI</h1>
    <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">The AI Startup Truth Engine</p>
  </div>

  ${isResend ? `
  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">This is a re-delivery of your report.</p>
  </div>
  ` : ''}

  <div style="background: linear-gradient(135deg, #7C3AED, #A78BFA); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
    <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Your Survival Score</p>
    <p style="color: #fff; font-size: 52px; font-weight: bold; margin: 0; line-height: 1;">${score}/100</p>
    <p style="color: rgba(255,255,255,0.95); font-size: 16px; margin: 8px 0 0;">${band}</p>
  </div>

  <div style="background-color: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a2e; font-size: 20px; margin: 0 0 12px;">${isResend ? 'Your Report (Re-delivery)' : 'Your Report is Ready'}</h2>

    <p style="line-height: 1.6; color: #374151;">Thank you for ordering the <strong>${tier}</strong>. Your personalized Survival Score Report is ${hasPdf ? 'attached to this email' : 'ready for download'}.</p>

    ${hasPdf ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${pdfUrl}" style="display: inline-block; background-color: #7C3AED; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">📄 Download Your Report</a>
    </div>
    ` : `
    <p style="color: #6b7280; font-style: italic;">Your report is being generated. You'll receive another email shortly with the download link.</p>
    `}

    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #374151;"><strong>What's inside your report:</strong></p>
      <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #6b7280;">
        <li>Survival Score breakdown across 5 metrics</li>
        <li>Top 3 financial leaks identified</li>
        <li>30-day recovery action plan</li>
        <li>Investor perception analysis</li>
        <li>Industry benchmark comparison</li>
      </ul>
    </div>
  </div>

  <div style="text-align: center; margin-top: 32px;">
    <p style="color: #9ca3af; font-size: 12px;">Order #${orderId || 'N/A'} • ${tier}</p>
    <p style="color: #9ca3af; font-size: 12px;">Need help? Reply to this email or visit <a href="https://foundersroi.com/contact" style="color: #7C3AED;">foundersroi.com/contact</a></p>
  </div>
</body>
</html>`;
}

async function updateOrderEmailSent(orderId) {
  const pbUrl = process.env.POCKETBASE_URL;
  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!pbUrl || !adminEmail || !adminPassword) return;

  // Auth
  const authRes = await fetch(`${pbUrl}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: adminEmail, password: adminPassword }),
  });
  if (!authRes.ok) return;
  const { token } = await authRes.json();

  // Update
  await fetch(`${pbUrl}/api/collections/orders/records/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    }),
  });
}
