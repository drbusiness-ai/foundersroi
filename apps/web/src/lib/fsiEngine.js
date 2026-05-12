/**
 * FoundersROI — Founder Survival Index (FSI) Engine
 * 100% deterministic, client-side, offline-capable.
 * No external dependencies. No AI calls.
 */

// ── Survival Band Definitions ──────────────────────────────
const BANDS = [
  { min: 0,  max: 30,  label: 'Critical',       emoji: '🔴', color: '#EF4444', description: 'Immediate intervention needed' },
  { min: 31, max: 50,  label: 'Struggling',      emoji: '🟠', color: '#F97316', description: 'Serious leaks present' },
  { min: 51, max: 65,  label: 'Stable',           emoji: '🟡', color: '#EAB308', description: 'Fixable with clear guidance' },
  { min: 66, max: 85,  label: 'Growing',          emoji: '🟢', color: '#22C55E', description: 'Investor-fundable path visible' },
  { min: 86, max: 100, label: 'Investor Grade',   emoji: '🚀', color: '#8B5CF6', description: 'Ready to raise' },
];

// ── Industry Benchmarks ────────────────────────────────────
const BENCHMARKS = {
  runway: { good: 18, median: 12, danger: 6, unit: 'months' },
  burnMultiple: { good: 1, median: 2, danger: 5, unit: 'x' },
  cacLtv: { good: 3, median: 1.5, danger: 0.8, unit: 'x' },
  churn: { good: 2, median: 5, danger: 12, unit: '%' },
  revenueMomentum: { good: 2, median: 0.8, danger: 0.3, unit: 'x' },
};

// ── Sub-Score Calculators ──────────────────────────────────

/**
 * Runway Score (25% weight)
 * 18 months runway = 100, 0 months = 0
 */
function calcRunwayScore(cashInBank, monthlyBurn) {
  if (monthlyBurn <= 0) return { score: 100, value: Infinity, label: 'Runway' };
  const runwayMonths = cashInBank / monthlyBurn;
  const score = Math.min(Math.round((runwayMonths / 18) * 100), 100);
  return {
    score: Math.max(0, score),
    value: Math.round(runwayMonths * 10) / 10,
    label: 'Runway',
    unit: 'months',
    benchmark: BENCHMARKS.runway,
  };
}

/**
 * Burn Multiple Score (20% weight)
 * <1x = 100, >5x = 0
 */
function calcBurnMultipleScore(monthlyBurn, monthlyRevenue) {
  const netBurn = monthlyBurn - monthlyRevenue;
  const netNewARR = Math.max(monthlyRevenue, 1);
  const burnMultiple = netBurn / netNewARR;

  if (burnMultiple <= 0) return { score: 100, value: 0, label: 'Burn Multiple', unit: 'x', benchmark: BENCHMARKS.burnMultiple };

  const score = Math.max(0, Math.round(100 - burnMultiple * 20));
  return {
    score,
    value: Math.round(burnMultiple * 10) / 10,
    label: 'Burn Multiple',
    unit: 'x',
    benchmark: BENCHMARKS.burnMultiple,
  };
}

/**
 * CAC/LTV Ratio Score (20% weight)
 * 3x LTV:CAC = 100, 0x = 0
 */
function calcCacLtvScore(ltv, cac) {
  const ratio = ltv / Math.max(cac, 1);
  const score = Math.min(Math.round((ratio / 3) * 100), 100);
  return {
    score: Math.max(0, score),
    value: Math.round(ratio * 10) / 10,
    label: 'LTV:CAC Ratio',
    unit: 'x',
    benchmark: BENCHMARKS.cacLtv,
  };
}

/**
 * Churn Score (20% weight)
 * <2% monthly = 100, >12% = 0
 */
function calcChurnScore(monthlyChurnPercent) {
  const score = Math.max(0, Math.round(100 - (monthlyChurnPercent - 2) * 10));
  return {
    score: Math.min(100, score),
    value: monthlyChurnPercent,
    label: 'Monthly Churn',
    unit: '%',
    benchmark: BENCHMARKS.churn,
  };
}

/**
 * Revenue Momentum Score (15% weight)
 * Revenue >= 2x Burn = 100, 0 = 0
 */
function calcRevenueMomentumScore(monthlyRevenue, monthlyBurn) {
  const ratio = monthlyRevenue / Math.max(monthlyBurn, 1);
  const score = Math.min(Math.round(ratio * 50), 100);
  return {
    score: Math.max(0, score),
    value: Math.round(ratio * 10) / 10,
    label: 'Revenue vs Burn',
    unit: 'x',
    benchmark: BENCHMARKS.revenueMomentum,
  };
}

// ── "Oh Sh*t Moment" Generator ─────────────────────────────

function generateOhShitMoment(metrics) {
  const { runway, burnMultiple, cacLtv, churn, revenueMomentum } = metrics;

  // Find worst metric
  const sorted = [
    { key: 'runway', score: runway.score, value: runway.value },
    { key: 'burnMultiple', score: burnMultiple.score, value: burnMultiple.value },
    { key: 'cacLtv', score: cacLtv.score, value: cacLtv.value },
    { key: 'churn', score: churn.score, value: churn.value },
    { key: 'revenueMomentum', score: revenueMomentum.score, value: revenueMomentum.value },
  ].sort((a, b) => a.score - b.score);

  const worst = sorted[0];

  switch (worst.key) {
    case 'runway':
      if (worst.value < 3) return `At your current burn, you have ${worst.value} months before the lights go out. This is an emergency.`;
      if (worst.value < 6) return `You have less than 6 months of runway. Every day without a fix costs you money you can't afford to lose.`;
      return `Your runway looks tight at ${worst.value} months — most investors want to see 18+ months.`;

    case 'burnMultiple':
      if (worst.value > 5) return `You're burning cash ${worst.value}x faster than you're growing — this trajectory leads to shutdown.`;
      if (worst.value > 3) return `Your burn multiple of ${worst.value}x means you're spending $${worst.value} to earn $1 in new revenue.`;
      return `Your burn multiple of ${worst.value}x is high — aim for below 2x to attract investors.`;

    case 'cacLtv':
      if (worst.value < 1) return `You're paying more to acquire customers than they're worth. You lose money on every sale.`;
      if (worst.value < 2) return `Your LTV:CAC ratio of ${worst.value}x is dangerously low — you need at least 3x to build a sustainable business.`;
      return `Your LTV:CAC of ${worst.value}x has room for improvement — healthy SaaS companies target 3x or more.`;

    case 'churn':
      if (worst.value > 10) return `At ${worst.value}% monthly churn, you lose your entire customer base every ${Math.round(100 / worst.value)} months. Fix retention before everything else.`;
      if (worst.value > 7) return `You're filling a leaky bucket — ${worst.value}% monthly churn means customers are leaving faster than you can replace them.`;
      return `Monthly churn at ${worst.value}% is above the healthy 2% benchmark — each percent costs you compound growth.`;

    case 'revenueMomentum':
      if (worst.value < 0.3) return `Your revenue covers less than 30% of your burn. You're essentially pre-product-market fit on the financials.`;
      if (worst.value < 0.6) return `Revenue momentum is weak — you're earning far less than you burn each month.`;
      return `Your revenue-to-burn ratio needs work. Investors look for startups approaching or exceeding 1x.`;

    default:
      return `Your fundamentals need work before scaling. Focus on the weakest metric first.`;
  }
}

// ── Metric Status Helper ───────────────────────────────────

function getMetricStatus(score) {
  if (score >= 70) return 'good';
  if (score >= 40) return 'warning';
  return 'danger';
}

// ── Band Lookup ────────────────────────────────────────────

function getBand(score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return BANDS.find(b => clamped >= b.min && clamped <= b.max) || BANDS[0];
}

// ── Main FSI Calculator ────────────────────────────────────

/**
 * Calculate the Founder Survival Index score.
 *
 * @param {Object} inputs
 * @param {number} inputs.monthlyRevenue  — Monthly revenue in $
 * @param {number} inputs.monthlyBurn     — Monthly burn in $
 * @param {number} inputs.cashInBank      — Cash in bank in $
 * @param {number} inputs.cac             — Customer Acquisition Cost in $
 * @param {number} inputs.ltv             — Average Lifetime Value in $
 * @param {number} inputs.monthlyChurn    — Monthly churn rate in %
 * @param {number} inputs.teamSize        — Number of team members
 * @param {string} inputs.stage           — Funding stage
 * @param {string} inputs.businessModel   — Business model type
 *
 * @returns {Object} FSI result
 */
export function calculateFSI(inputs) {
  const {
    monthlyRevenue = 0,
    monthlyBurn = 0,
    cashInBank = 0,
    cac = 0,
    ltv = 0,
    monthlyChurn = 0,
  } = inputs;

  // Calculate sub-scores
  const runway = calcRunwayScore(cashInBank, monthlyBurn);
  const burnMultiple = calcBurnMultipleScore(monthlyBurn, monthlyRevenue);
  const cacLtv = calcCacLtvScore(ltv, cac);
  const churn = calcChurnScore(monthlyChurn);
  const revenueMomentum = calcRevenueMomentumScore(monthlyRevenue, monthlyBurn);

  // Weighted FSI score
  const rawScore =
    runway.score * 0.25 +
    burnMultiple.score * 0.20 +
    cacLtv.score * 0.20 +
    churn.score * 0.20 +
    revenueMomentum.score * 0.15;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const band = getBand(score);

  // Generate diagnostic one-liner
  const metrics = { runway, burnMultiple, cacLtv, churn, revenueMomentum };
  const ohShitMoment = generateOhShitMoment(metrics);

  // Build metric breakdown array
  const metricBreakdown = [
    { ...runway, weight: '25%', status: getMetricStatus(runway.score) },
    { ...burnMultiple, weight: '20%', status: getMetricStatus(burnMultiple.score) },
    { ...cacLtv, weight: '20%', status: getMetricStatus(cacLtv.score) },
    { ...churn, weight: '20%', status: getMetricStatus(churn.score) },
    { ...revenueMomentum, weight: '15%', status: getMetricStatus(revenueMomentum.score) },
  ];

  return {
    score,
    band: band.label,
    color: band.color,
    emoji: band.emoji,
    description: band.description,
    ohShitMoment,
    metricBreakdown,
    runwayMonths: runway.value === Infinity ? '∞' : runway.value,
  };
}

// Export constants for use in UI
export { BANDS, BENCHMARKS };
