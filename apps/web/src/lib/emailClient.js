/**
 * emailClient.js — Client-side email delivery helper.
 *
 * Triggers report email delivery via the /api/send-report-email serverless
 * function. The actual email sending happens server-side (Resend API) so
 * the Resend API key is never exposed to the browser.
 *
 * Usage:
 *   import { deliverReportEmail } from '@/lib/emailClient.js';
 *   await deliverReportEmail({
 *     to: 'founder@startup.com',
 *     pdfUrl: 'https://storage.example.com/report.pdf',
 *     orderData: { tier: 'l1', score: 52, band: 'Stable' },
 *   });
 */

// ── API Endpoint ───────────────────────────────────────────

function getEmailApiEndpoint() {
  if (import.meta.env.VITE_EMAIL_API_URL) {
    return import.meta.env.VITE_EMAIL_API_URL;
  }
  return '/api/send-report-email';
}

// ── Public API ──────────────────────────────────────────────

/**
 * Request the server to deliver a report email via Resend.
 *
 * Note: In the normal flow, the Stripe webhook triggers email delivery
 * automatically. This function is for manual/retry scenarios or for
 * testing the email pipeline independently.
 *
 * @param {Object} options
 * @param {string} options.to                    — recipient email address
 * @param {string} options.pdfUrl                — publicly accessible PDF download URL
 * @param {Object} options.orderData             — order context
 * @param {string} options.orderData.tier        — pricing tier (l1/l2/l3/l4)
 * @param {string} options.orderData.tierLabel   — human-readable tier name
 * @param {number} options.orderData.score       — FSI survival score
 * @param {string} options.orderData.band        — survival band
 * @param {string} [options.orderData.companyName] — company name for email personalization
 * @param {string} [options.orderData.ohShitMoment] — Oh Sh*t Moment for email preview
 * @throws {Error} if the email cannot be sent
 * @returns {Promise<Object>} delivery result from server
 */
export async function deliverReportEmail({
  to,
  pdfUrl,
  orderData = {},
}) {
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    throw new Error('A valid recipient email is required');
  }

  if (!pdfUrl || typeof pdfUrl !== 'string') {
    throw new Error('A valid PDF URL is required');
  }

  try {
    const endpoint = getEmailApiEndpoint();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        pdfUrl,
        orderData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Email delivery failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error('[emailClient] Email delivery failed:', err);
    throw err;
  }
}

/**
 * Trigger a manual resend for an existing order.
 * Used from admin dashboard or retry mechanisms.
 *
 * @param {string} orderId  — PocketBase order record ID
 * @param {string} email    — recipient email to deliver to
 * @throws {Error}
 * @returns {Promise<Object>}
 */
export async function resendReportEmail(orderId, email) {
  if (!orderId) throw new Error('Order ID is required');

  try {
    const endpoint = getEmailApiEndpoint();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        to: email,
        resend: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Resend failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error('[emailClient] Resend failed:', err);
    throw err;
  }
}
