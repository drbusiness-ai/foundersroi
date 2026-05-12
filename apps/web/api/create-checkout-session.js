/**
 * /api/create-checkout-session — Vercel serverless function
 *
 * Creates a Stripe Checkout Session and returns the Stripe-hosted URL.
 * The user is then redirected to Stripe to complete payment.
 *
 * POST body:
 *   priceId: string        — Stripe Price ID (e.g., price_l1_scan)
 *   customerEmail: string  — founder's email
 *   metadata: object       — key-value pairs stored on the Stripe session
 *   successUrl: string     — redirect on successful payment
 *   cancelUrl: string      — redirect on cancelled payment
 *
 * Required env vars (set in Vercel dashboard):
 *   STRIPE_SECRET_KEY=sk_live_... or sk_test_...
 *
 * Note: This file runs in a Node.js runtime on Vercel, NOT in the browser.
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Stripe secret key
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('[create-checkout-session] STRIPE_SECRET_KEY not set');
    return res.status(500).json({ error: 'Payment service not configured' });
  }

  // Dynamically import Stripe (server-side only, not bundled into client)
  let Stripe;
  try {
    const stripeModule = await import('stripe');
    Stripe = stripeModule.default;
  } catch (err) {
    console.error('[create-checkout-session] Failed to load stripe module:', err);
    return res.status(500).json({ error: 'Payment service unavailable' });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const { priceId, customerEmail, metadata, successUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
    }
    if (!customerEmail) {
      return res.status(400).json({ error: 'customerEmail is required' });
    }
    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'successUrl and cancelUrl are required' });
    }

    // Validate success URL is not external (prevent open redirect)
    const allowedOrigins = [
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      process.env.VITE_APP_URL,
      'http://localhost:3000',
    ].filter(Boolean);

    const isAllowedUrl = allowedOrigins.some((origin) => successUrl.startsWith(origin));
    if (!isAllowedUrl && !successUrl.startsWith('/')) {
      console.warn('[create-checkout-session] Success URL does not match allowed origins');
    }

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        ...metadata,
        // Override any user-submitted metadata that shouldn't be in customer control
        createdVia: 'foundersroi-pricing-page',
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Allow promotion codes for discounts
      allow_promotion_codes: true,
      // Collect tax ID for business customers (optional)
      tax_id_collection: {
        enabled: false,
      },
      // Automatic tax calculation (set up in Stripe Dashboard first)
      automatic_tax: {
        enabled: false,
      },
    });

    console.log(`[create-checkout-session] Session created: ${session.id} for ${customerEmail} (${metadata.tierLabel || priceId})`);

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[create-checkout-session] Stripe error:', err.message);

    // Handle specific Stripe errors
    if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: `Invalid request: ${err.message}` });
    }

    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
