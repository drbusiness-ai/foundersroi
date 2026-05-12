/**
 * reportSections.js — Template-based fallback report content generator.
 * Produces structured report sections when GPT-4o is unavailable or for
 * preview/testing purposes. All content is deterministic, derived from
 * FSI results and user inputs with zero external API calls.
 *
 * The output format matches aiNarrativeEngine.js so callers can use either
 * interchangeably.
 */

import { BANDS, BENCHMARKS } from './fsiEngine.js';

// ── Section Builders ───────────────────────────────────────

function buildSurvivalStory(fsiResult, formData) {
  const { score, band, emoji, description, ohShitMoment } = fsiResult;
  const name = formData.companyName || 'Your startup';

  return [
    `${name} scores ${score}/100 — ${emoji} ${band}.`,
    description,
    ohShitMoment,
  ].join('\n\n');
}

function buildTopLeaks(fsiResult) {
  const { metricBreakdown } = fsiResult;

  // Sort metrics by score ascending (worst first), take top 3
  const sorted = [...metricBreakdown]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return sorted.map((m, i) => ({
    title: `Leak #${i + 1}: ${m.label} (${m.score}/100)`,
    diagnosis: m.score < 40
      ? `Your ${m.label.toLowerCase()} is critically below the healthy benchmark of ${m.benchmark.good}${m.unit}.`
      : m.score < 70
        ? `Your ${m.label.toLowerCase()} is below the healthy benchmark — there's room for significant improvement.`
        : `Your ${m.label.toLowerCase()} is approaching healthy levels, but fine-tuning could yield compound returns.`,
    impact: m.score < 40
      ? 'This is a red flag for investors and threatens runway sustainability.'
      : m.score < 70
        ? 'This metric is dragging down your overall survival score and investor readiness.'
        : 'While not critical, improving this metric would accelerate your path to Investor Grade.',
  }));
}

function buildQuickWins(fsiResult) {
  const { metricBreakdown } = fsiResult;
  const sorted = [...metricBreakdown].sort((a, b) => a.score - b.score);
  const worst = sorted[0];
  const secondWorst = sorted[1];
  const thirdWorst = sorted[2];

  return [
    {
      action: `Address ${worst.label}`,
      expectedOutcome: `Move ${worst.label} from ${worst.score}/100 to 70+/100 within 30 days by targeting the root cause identified in your Leaks section.`,
      timeline: '0–30 Days',
    },
    {
      action: `Optimize ${secondWorst.label}`,
      expectedOutcome: `Improving ${secondWorst.label} from ${secondWorst.score}/100 will directly improve your runway projection and investor narrative.`,
      timeline: '30–60 Days',
    },
    {
      action: `Strengthen ${thirdWorst.label}`,
      expectedOutcome: `Even a 10-point improvement in ${thirdWorst.label} will compound with your other fixes for a significantly stronger overall profile.`,
      timeline: '60–90 Days',
    },
  ];
}

function build30DayPlan(fsiResult, formData) {
  const { metricBreakdown } = fsiResult;
  const sorted = [...metricBreakdown].sort((a, b) => a.score - b.score);

  return [
    {
      week: 'Week 1',
      focus: `Diagnose ${sorted[0].label}`,
      actions: [
        `Deep-dive analysis of why your ${sorted[0].label.toLowerCase()} is at ${sorted[0].score}/100`,
        'Pull historical data for the past 3-6 months to identify trends',
        'Document the root cause in 1-2 sentences',
      ],
    },
    {
      week: 'Week 2',
      focus: 'Implement Immediate Fix',
      actions: [
        `Address the single biggest driver of poor ${sorted[0].label.toLowerCase()} performance`,
        'Set a measurable 30-day target for this metric',
        'Notify your team of the priority shift',
      ],
    },
    {
      week: 'Week 3',
      focus: `Address ${sorted[1].label}`,
      actions: [
        `Begin analyzing ${sorted[1].label.toLowerCase()} (${sorted[1].score}/100)`,
        'Identify 1-2 low-effort, high-impact changes',
        'Implement the quickest fix this week',
      ],
    },
    {
      week: 'Week 4',
      focus: 'Measure & Course-Correct',
      actions: [
        'Compare Week 4 numbers against Week 1 baseline',
        'Document what worked and what didn\'t',
        'Build a 60-day plan from the learnings',
      ],
    },
  ];
}

function build6090DayPlan(fsiResult) {
  const { metricBreakdown } = fsiResult;
  const sorted = [...metricBreakdown].sort((a, b) => a.score - b.score);

  return [
    {
      milestone: 'Month 2 — Stabilize',
      actions: [
        `Bring ${sorted[0].label} into the 60+ range`,
        `Begin tracking ${sorted[1].label} weekly instead of monthly`,
        'Set up a financial dashboard with real-time metric monitoring',
      ],
    },
    {
      milestone: 'Month 3 — Growth Readiness',
      actions: [
        `Target ${sorted[2].label} improvement to 70+`,
        'Review all metrics against industry benchmarks',
        'Prepare an investor-ready financial narrative',
      ],
    },
  ];
}

function buildInvestorPerception(fsiResult, formData) {
  const { score, band } = fsiResult;
  const stage = formData.stage || 'startup';

  if (score >= 86) {
    return `With a ${score}/100 ${band} score at the ${stage} stage, investors will see a financially disciplined team with strong unit economics. Your numbers tell a story of sustainable growth — exactly what Series A/B investors look for. Highlight your FSI score in your pitch deck data room.`;
  }
  if (score >= 66) {
    return `At ${score}/100 (${band}), a seed or Series A investor will see potential with fixable gaps. They'll want to know: "What's your plan to close the gap on your weakest metrics?" If you can show a 30-day improvement trend in your next update, you strengthen your negotiating position significantly.`;
  }
  if (score >= 51) {
    return `A ${score}/100 ${band} score at ${stage} stage will raise eyebrows with investors — not disqualifying, but they will dig deep on your financial discipline. The good news: showing a concrete improvement plan (this report) before they ask is a strong signal of founder maturity.`;
  }
  if (score >= 31) {
    return `Investors seeing a ${score}/100 ${band} score at ${stage} stage will be cautious. They'll interpret this as either (a) the founder doesn't track financials closely, or (b) there are structural business model issues. Either way, fixing your top 3 leaks before fundraising is critical.`;
  }
  return `A ${score}/100 ${band} score at ${stage} stage will likely deter most institutional investors. This score signals a business in distress — and investors have too many options to take that risk. Focus 100% on operational fixes before approaching any investor conversations.`;
}

function buildIndustryBenchmarks(fsiResult, formData) {
  const { metricBreakdown } = fsiResult;
  const model = formData.businessModel || 'SaaS';

  // Simple benchmark ranges per business model (expandable)
  const modelBenchmarks = {
    'SaaS': { runway: '12-18 months', burnMultiple: '<2x', cacLtv: '>3x', churn: '<3%', revenueMomentum: '>1x' },
    'E-commerce': { runway: '6-12 months', burnMultiple: '<1.5x', cacLtv: '>2x', churn: '<10%', revenueMomentum: '>2x' },
    'Marketplace': { runway: '12-24 months', burnMultiple: '<2x', cacLtv: '>4x', churn: '<5%', revenueMomentum: '>1x' },
    'Services': { runway: '3-6 months', burnMultiple: '<1x', cacLtv: '>3x', churn: '<5%', revenueMomentum: '>1.5x' },
  };

  const benchmarks = modelBenchmarks[model] || modelBenchmarks['SaaS'];

  const labelMap = {
    'Runway': 'runway',
    'Burn Multiple': 'burnMultiple',
    'LTV:CAC Ratio': 'cacLtv',
    'Monthly Churn': 'churn',
    'Revenue vs Burn': 'revenueMomentum',
  };

  return metricBreakdown.map(m => ({
    metric: m.label,
    yourValue: `${m.value}${m.unit}`,
    yourScore: `${m.score}/100`,
    industryHealthy: benchmarks[labelMap[m.label]] || 'N/A',
    status: m.score >= 70 ? '✅ At/Above Benchmark' : m.score >= 40 ? '⚠️ Below Benchmark' : '🔴 Critical Gap',
  }));
}

// ── Main Export ────────────────────────────────────────────

/**
 * Generate a complete report using template-based logic.
 * Returns the same structure as aiNarrativeEngine.generateReport().
 *
 * @param {Object} fsiResult — output of calculateFSI()
 * @param {Object} formData  — user's form inputs (companyName, stage, businessModel, worry[])
 * @returns {Object} report sections
 */
export function generateTemplateReport(fsiResult, formData = {}) {
  return {
    source: 'template',
    survivalStory: buildSurvivalStory(fsiResult, formData),
    ohShitMoment: fsiResult.ohShitMoment,
    top3Leaks: buildTopLeaks(fsiResult),
    top3QuickWins: buildQuickWins(fsiResult),
    thirtyDayPlan: build30DayPlan(fsiResult, formData),
    sixtyNinetyDayPlan: build6090DayPlan(fsiResult),
    investorPerception: buildInvestorPerception(fsiResult, formData),
    industryBenchmarks: buildIndustryBenchmarks(fsiResult, formData),
    generatedAt: new Date().toISOString(),
  };
}

export default generateTemplateReport;
