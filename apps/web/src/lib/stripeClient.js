/**
 * stripeClient.js — Client-side Stripe Checkout handler.
 *
 * Redirects users to Stripe's hosted Checkout page for payment.
 * Requires a serverless function at /api/create-checkout-session that
 * creates the Stripe Checkout Session and returns the URL.
 *
 * Usage:
 *   import { redirectToStripeCheckout } from '@/lib/stripeClient.js';
 *   await redirectToStripeCheckout({
 *     tier: 'l1',
 *     email: 'founder@startup.com',
 *     fsiResult: { ... },
 *     formData: { ... },
 *   });
 */

// ── Tier Configuration ──────────────────────────────────────

/**
 * Price IDs must be created in the Stripe Dashboard.
 * These are placeholder values — replace with real Stripe Price IDs.
 *
 * Product > Pricing Models in Stripe Dashboard:
 *   1. Create one Product per tier (e.g., "AI Survival Scan")
 *   2. Add a one-time price in USD under each product
 *   3. Copy the price_xxx ID here
 */
const TIER_PRICE_IDS = {
  l1: import.meta.env.VITE_STRIPE_PRICE_L1 || 'price_l1_scan',      // $49
  l2: import.meta.env.VITE_STRIPE_PRICE_L2 || 'price_l2_audit',     // $297
  l3: import.meta.env.VITE_STRIPE_PRICE_L3 || 'price_l3_triage',    // $997
  l4: import.meta.env.VITE_STRIPE_PRICE_L4 || 'price_l4_sprint',    // $2,497
};

const TIER_LABELS = {
  l1: 'AI Survival Scan',
  l2: 'Founder Truth Audit',
  l3: 'Financial Triage',
  l4: 'Recovery Sprint',
};

// ── API Endpoint ───────────────────────────────────────────

/**
 * Resolve the checkout API endpoint.
 * In production (Vercel), this is /api/create-checkout-session relative to the Vite app.
 * In development, this can be configured via env var to point to a local dev server.
 */
function getApiEndpoint() {
  if (import.meta.env.VITE_CHECKOUT_API_URL) {
    return import.meta.env.VITE_CHECKOUT_API_URL;
  }
  // Default: same-origin, works on Vercel where /api/* is deployed alongside the SPA
  return '/api/create-checkout-session';
}

// ── Public API ──────────────────────────────────────────────

/**
 * Redirect the user to a Stripe hosted Checkout page.
 *
 * @param {Object} options
 * @param {'l1'|'l2'|'l3'|'l4'} options.tier            — pricing tier
 * @param {string} options.email                         — customer email
 * @param {Object} options.fsiResult                     — FSI engine output (for metadata)
 * @param {Object} options.formData                      — user form inputs (for order recovery)
 * @param {string} [options.successUrl]                  — redirect after successful payment
 * @param {string} [options.cancelUrl]                   — redirect if payment cancelled
 * @param {string} [options.calculatorSessionId]         — PocketBase session record ID
 * @throws {Error} if the checkout session cannot be created
 * @returns {Promise<void>} redirects to Stripe (never resolves in same tab)
 */
export async function redirectToStripeCheckout({
  tier,
  email,
  fsiResult = {},
  formData = {},
  successUrl,
  cancelUrl,
  calculatorSessionId,
}) {
  if (!tier || !TIER_PRICE_IDS[tier]) {
    throw new Error(`Invalid tier: ${tier}. Must be one of: ${Object.keys(TIER_PRICE_IDS).join(', ')}`);
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error('A valid customer email is required for Stripe Checkout');
  }

  const priceId = TIER_PRICE_IDS[tier];

  // Build success/cancel URLs with sensible defaults
  const baseUrl = window.location.origin;
  const resolvedSuccessUrl = successUrl || `${baseUrl}/score-result?session_id={CHECKOUT_SESSION_ID}`;
  const resolvedCancelUrl = cancelUrl || `${baseUrl}/pricing?cancelled=true`;

  // Prepare metadata for the Stripe session (used by webhook to generate report)
  const metadata = {
    tier,
    tierLabel: TIER_LABELS[tier],
    fsiScore: String(fsiResult.score ?? ''),
    survivalBand: fsiResult.band ?? '',
    calculatorSessionId: calculatorSessionId ?? '',
    // Store a compressed version of formData for webhook recovery
    // Stripe metadata has a 500 char limit per key, so we JSON-stringify and
    // keep only essential fields
    formDataCompact: JSON.stringify({
      cn: formData.companyName || '',
      st: formData.stage || '',
      bm: formData.businessModel || '',
      mr: formData.monthlyRevenue ?? 0,
      mb: formData.monthlyBurn ?? 0,
      cb: formData.cashInBank ?? 0,
      ca: formData.cac ?? 0,
      lt: formData.ltv ?? 0,
      ch: formData.monthlyChurn ?? 0,
      ts: formData.teamSize ?? 0,
    }),
  };

  try {
    const endpoint = getApiEndpoint();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        customerEmail: email,
        metadata,
        successUrl: resolvedSuccessUrl,
        cancelUrl: resolvedCancelUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Checkout session creation failed (${response.status})`);
    }

    const { url } = await response.json();

    if (!url) {
      throw new Error('No checkout URL returned from server');
    }

    // Redirect to Stripe hosted Checkout
    window.location.href = url;
  } catch (err) {
    console.error('[stripeClient] Checkout redirect failed:', err);
    throw err;
  }
}

/**
 * Get the Stripe publishable key for the current environment.
 * Falls back to a test key if not configured.
 */
export function getStripePublishableKey() {
  if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  }
  // Default: Stripe test mode publishable key (safe to commit — it's the public key)
  // Replace this with your own test key from https://dashboard.stripe.com/test/apikeys
  console.warn('[stripeClient] No VITE_STRIPE_PUBLISHABLE_KEY set — using fallback');
  return 'pk_test_placeholder';
}

/**
 * Toggle between test/live mode for Stripe.
 */
export function isStripeLiveMode() {
  const key = getStripePublishableKey();
  return key.startsWith('pk_live_');
}

export { TIER_PRICE_IDS, TIER_LABELS };
