/**
 * PdfReport.jsx — FoundersROI PDF Report assembler using @react-pdf/renderer.
 *
 * Builds a 12-page PDF from FSI results + AI/template report content.
 * All pages are defined in this file to keep the PDF build process cohesive.
 *
 * Usage:
 *   import { PdfReport } from './lib/pdf/PdfReport.jsx';
 *   const blob = await pdf(<PdfReport data={data} />).toBlob();
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  Font,
} from '@react-pdf/renderer';

// ── Register Fonts (system-safe: Helvetica always available) ─
// For production, register Inter and JetBrains Mono fonts.
// Font.register({ family: 'Inter', fonts: [...] });

// ── Color Palette ────────────────────────────────────────────
const COLORS = {
  primary: '#7C3AED',
  dark: '#1E1B4B',
  text: '#1F2937',
  muted: '#6B7280',
  light: '#F3F4F6',
  white: '#FFFFFF',
  green: '#22C55E',
  yellow: '#EAB308',
  amber: '#D97706',
  red: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316',
};

// ── Shared Styles ───────────────────────────────────────────
const s = StyleSheet.create({
  page: { backgroundColor: COLORS.white, padding: 40, fontFamily: 'Helvetica' },
  pageDark: { backgroundColor: COLORS.dark, padding: 40, fontFamily: 'Helvetica' },
  h1: { fontSize: 28, fontWeight: 'bold', color: COLORS.dark, marginBottom: 8 },
  h2: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12 },
  h3: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, marginBottom: 6 },
  body: { fontSize: 11, color: COLORS.text, lineHeight: 1.6, marginBottom: 10 },
  muted: { fontSize: 9, color: COLORS.muted },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  badge: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, fontWeight: 'bold' },
  card: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  bold: { fontWeight: 'bold' },
  pageNumber: { position: 'absolute', bottom: 20, right: 40, fontSize: 9, color: COLORS.muted },
});

// ── Helper: Metric status color ─────────────────────────────
function statusColor(score) {
  if (score >= 70) return COLORS.green;
  if (score >= 40) return COLORS.yellow;
  return COLORS.red;
}

// ── PAGE 1: Cover ───────────────────────────────────────────
function PdfCover({ companyName, score, band, color, emoji, date }) {
  return (
    <Page size="A4" style={[s.pageDark, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 14, color: COLORS.muted, marginBottom: 24 }}>FoundersROI.com</Text>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 72, fontWeight: 'bold', color: color }}>{score}</Text>
        <Text style={{ fontSize: 16, color: COLORS.muted, fontFamily: 'Helvetica' }}>/ 100</Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>
        {emoji} {band}
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.muted, marginBottom: 32 }}>
        {companyName || 'Your Startup'} — Survival Score Report
      </Text>
      <View style={{ height: 1, width: 120, backgroundColor: color, marginBottom: 20 }} />
      <Text style={{ fontSize: 10, color: COLORS.muted }}>{date}</Text>
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 2: Diagnostic Section (band-aware) ────────────────
function PdfOhShitMoment({ ohShitMoment, survivalStory, diagnosticLabel }) {
  const tone = diagnosticLabel?.tone || 'danger';

  const config = {
    praise:   { bg: '#F0FDF4', border: '#86EFAC', accent: COLORS.green,  emoji: '🚀', heading: 'Investor Take' },
    positive: { bg: '#F0FDF4', border: '#86EFAC', accent: COLORS.green,  emoji: '💪', heading: 'Your Strengths' },
    neutral:  { bg: '#FFFBEB', border: '#FCD34D', accent: COLORS.amber,  emoji: '🔍', heading: 'What Needs Attention' },
    danger:   { bg: '#FEF2F2', border: '#FECACA', accent: COLORS.red,    emoji: '⚠️', heading: "The 'Oh Sh*t' Moment" },
  };

  const cfg = config[tone] || config.danger;

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>The Truth.</Text>
      <View style={s.divider} />
      <Text style={s.body}>{survivalStory}</Text>
      <View style={[{ ...s.card, backgroundColor: cfg.bg, borderColor: cfg.border, marginTop: 16 }]}>
        <Text style={[s.h3, { color: cfg.accent }]}>{cfg.emoji} {cfg.heading}</Text>
        <Text style={[s.body, { fontSize: 13, fontWeight: 'bold', marginTop: 8 }]}>
          "{ohShitMoment}"
        </Text>
      </View>
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 3: Score Breakdown Visual ──────────────────────────
function PdfScoreVisual({ score, band, color, emoji, description, metricBreakdown }) {
  const totalWeight = 100;
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>Your Survival Score</Text>
      <View style={s.divider} />
      <View style={[s.row, { gap: 16, marginBottom: 20 }]}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color }}>{score}</Text>
          <Text style={{ fontSize: 8, color: COLORS.muted }}>/100</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.h2, { marginBottom: 4 }]}>{emoji} {band}</Text>
          <Text style={s.body}>{description}</Text>
        </View>
      </View>
      <Text style={s.h3}>Metric Weights & Scores</Text>
      {metricBreakdown.map((m, i) => (
        <View key={i} style={s.card}>
          <View style={[s.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
            <Text style={[s.body, s.bold]}>{m.label}</Text>
            <Text style={[s.bold, { color: statusColor(m.score) }]}>{m.score}/100</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: 6, width: `${m.score}%`, backgroundColor: statusColor(m.score), borderRadius: 3 }} />
          </View>
          <Text style={s.muted}>Weight: {m.weight}  •  Value: {m.value}{m.unit}  •  Healthy: {m.benchmark.good}{m.unit}</Text>
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 4: Metric-by-Metric Analysis ───────────────────────
function PdfMetricGrid({ metricBreakdown }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>Metric-by-Metric Analysis</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 16 }]}>
        Each metric is scored 0-100 against industry benchmarks for your business model.
        Scores below 40 are critical, 40-70 need attention, and 70+ are healthy.
      </Text>
      {metricBreakdown.map((m, i) => (
        <View key={i} style={s.card} wrap={false}>
          <Text style={[s.h3, { color: statusColor(m.score) }]}>{m.label}: {m.score}/100</Text>
          <View style={[s.row, { gap: 16, marginTop: 6 }]}>
            <View><Text style={s.muted}>Your Value</Text><Text style={s.bold}>{m.value}{m.unit}</Text></View>
            <View><Text style={s.muted}>Healthy</Text><Text style={[s.bold, { color: COLORS.green }]}>{m.benchmark.good}{m.unit}</Text></View>
            <View><Text style={s.muted}>Median</Text><Text style={s.bold}>{m.benchmark.median}{m.unit}</Text></View>
            <View><Text style={s.muted}>Danger</Text><Text style={[s.bold, { color: COLORS.red }]}>{m.benchmark.danger}{m.unit}</Text></View>
          </View>
          <View style={{ height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
            <View style={{ height: 8, width: `${m.score}%`, backgroundColor: statusColor(m.score), borderRadius: 4 }} />
          </View>
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 5: Benchmark Comparison ────────────────────────────
function PdfBenchmarks({ industryBenchmarks }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>Industry Benchmark Comparison</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 16 }]}>
        How your metrics compare to healthy benchmarks in your industry.
        These are medians from public and private company data (SaaS, E-commerce, Marketplace, Services).
      </Text>
      {(industryBenchmarks || []).map((b, i) => (
        <View key={i} style={s.card}>
          <View style={[s.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
            <Text style={[s.body, s.bold]}>{b.metric}</Text>
            <Text style={[s.bold, {
              color: b.status?.startsWith('✅') ? COLORS.green : b.status?.startsWith('⚠') ? COLORS.yellow : COLORS.red,
            }]}>{b.status}</Text>
          </View>
          <View style={[s.row, { gap: 16 }]}>
            <Text style={s.body}>You: {b.yourValue} ({b.yourScore})</Text>
            <Text style={[s.body, { color: COLORS.green }]}>Industry: {b.industryHealthy}</Text>
          </View>
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 6: Top 3 Biggest Leaks ─────────────────────────────
function PdfLeaks({ top3Leaks = [] }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>Top 3 Biggest Leaks</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 16 }]}>
        These are the three metrics most likely to kill your startup if left unaddressed.
        Fix them in this order.
      </Text>
      {top3Leaks.map((leak, i) => (
        <View key={i} style={[s.card, { borderLeftWidth: 4, borderLeftColor: COLORS.red }]} wrap={false}>
          <Text style={[s.h3, { color: COLORS.red }]}>🔴 {leak.title}</Text>
          <Text style={s.body}>{leak.diagnosis}</Text>
          <View style={[{ ...s.card, backgroundColor: '#FEF2F2', marginTop: 8 }]}>
            <Text style={[s.body, s.bold, { color: COLORS.red }]}>Impact: </Text>
            <Text style={s.body}>{leak.impact}</Text>
          </View>
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 7: Top 3 Quick Wins ────────────────────────────────
function PdfQuickWins({ top3QuickWins = [] }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>Top 3 Quick Wins</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 16 }]}>
        Three actions you can take in the next 30-90 days to meaningfully improve
        your metrics and survival odds. Start with #1.
      </Text>
      {top3QuickWins.map((win, i) => (
        <View key={i} style={[s.card, { borderLeftWidth: 4, borderLeftColor: COLORS.green }]} wrap={false}>
          <View style={[s.row, { justifyContent: 'space-between', marginBottom: 6 }]}>
            <Text style={[s.h3, { color: COLORS.green }]}>✅ Quick Win #{i + 1}</Text>
            <Text style={[s.badge, { backgroundColor: '#DCFCE7', color: COLORS.green }]}>{win.timeline}</Text>
          </View>
          <Text style={[s.body, s.bold]}>{win.action}</Text>
          <Text style={s.body}>Expected Outcome: {win.expectedOutcome}</Text>
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 8: 30-Day Recovery Plan ────────────────────────────
function PdfRecoveryPlan({ thirtyDayPlan = [] }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>30-Day Recovery Plan</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 16 }]}>
        A week-by-week execution plan to stabilize your startup's financial position.
        Each week has one focus area and specific actions.
      </Text>
      {thirtyDayPlan.map((week, i) => (
        <View key={i} style={s.card} wrap={false}>
          <Text style={[s.h3, { color: COLORS.primary }]}>Week {i + 1}: {week.focus}</Text>
          {(week.actions || []).map((action, j) => (
            <View key={j} style={[s.row, { gap: 6, marginLeft: 4, marginTop: 4 }]}>
              <Text style={{ color: COLORS.primary, fontSize: 11 }}>▸</Text>
              <Text style={s.body}>{action}</Text>
            </View>
          ))}
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 9: 60-90 Day Growth Plan ───────────────────────────
function PdfGrowthPlan({ sixtyNinetyDayPlan = [] }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>60-90 Day Growth Plan</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 16 }]}>
        After stabilizing your leaky metrics in the first 30 days, shift focus to growth.
        These milestones will help you build momentum for the next funding conversation.
      </Text>
      {sixtyNinetyDayPlan.map((phase, i) => (
        <View key={i} style={s.card} wrap={false}>
          <Text style={[s.h3, { color: COLORS.primary }]}>{phase.milestone}</Text>
          {(phase.actions || []).map((action, j) => (
            <View key={j} style={[s.row, { gap: 6, marginLeft: 4, marginTop: 4 }]}>
              <Text style={{ color: COLORS.green, fontSize: 11 }}>▸</Text>
              <Text style={s.body}>{action}</Text>
            </View>
          ))}
        </View>
      ))}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 10: Investor Perception ────────────────────────────
function PdfInvestorView({ investorPerception, score, band, emoji }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>Investor Perception</Text>
      <View style={s.divider} />
      <View style={[s.card, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', marginBottom: 20 }]}>
        <Text style={[s.h2, { color: COLORS.primary }]}>How Investors See Your Numbers</Text>
        <Text style={[s.body, { fontSize: 13 }]}>{investorPerception}</Text>
      </View>
      <View style={[s.row, { gap: 12, marginBottom: 20 }]}>
        <View style={{ ...s.card, flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 36, marginBottom: 4 }}>{emoji}</Text>
          <Text style={[s.bold, { fontSize: 14 }]}>{score}/100</Text>
          <Text style={s.muted}>{band}</Text>
        </View>
      </View>
      <Text style={s.h3}>What Investors Want to See</Text>
      <Text style={s.body}>• Runway: 18+ months preferred for early-stage, 24+ for growth</Text>
      <Text style={s.body}>• Burn Multiple: Below 2x for efficient growth companies</Text>
      <Text style={s.body}>• LTV:CAC: At least 3x (meaning each customer is worth 3x their acquisition cost)</Text>
      <Text style={s.body}>• Churn: Below 3% monthly for SaaS</Text>
      <Text style={s.body}>• Revenue Momentum: Revenue covering or exceeding burn</Text>
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 11: Certified Badge + Score Card ───────────────────
function PdfBadge({ companyName, score, band, color, emoji }) {
  return (
    <Page size="A4" style={[s.page, { justifyContent: 'center', alignItems: 'center' }]}>
      <View style={{ alignItems: 'center', padding: 40, borderWidth: 3, borderColor: color, borderRadius: 16, width: '80%' }}>
        <Text style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>FoundersROI Certified</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12 }}>
          {companyName || 'Startup'}
        </Text>
        <View style={{ height: 1, width: 80, backgroundColor: color, marginBottom: 16 }} />
        <Text style={{ fontSize: 64, fontWeight: 'bold', color, marginBottom: 4 }}>{score}</Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginBottom: 8 }}>Survival Score / 100</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 }}>{emoji} {band}</Text>
        <View style={{ height: 1, width: 80, backgroundColor: color, marginVertical: 16 }} />
        <Text style={{ fontSize: 10, color: COLORS.muted }}>Verified by FoundersROI.com</Text>
      </View>
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── PAGE 12: Next Steps + Upsell ────────────────────────────
function PdfUpsell({ score, band }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.h1}>What's Next?</Text>
      <View style={s.divider} />
      <Text style={[s.body, { marginBottom: 20 }]}>
        Your {score}/100 ({band}) score is just the beginning. Here's how to go deeper:
      </Text>

      <View style={[s.card, { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}>
        <Text style={[s.h3, { color: COLORS.primary }]}>🔬 Founder Truth Audit — $297</Text>
        <Text style={s.body}>12-15 page AI + Human reviewed report with personalized Loom video walkthrough. Deep-dive analysis of every metric with a 30-day recovery plan and investor perception analysis. Delivered in 24 hours.</Text>
      </View>

      <View style={[s.card, { borderLeftWidth: 4, borderLeftColor: COLORS.purple }]}>
        <Text style={[s.h3, { color: COLORS.purple }]}>🚀 Recovery Sprint — $2,497</Text>
        <Text style={s.body}>5-week async program with weekly AI Truth Reports, Loom videos, unlimited Q&A, financial model reconstruction, and pitch deck review. For founders ready to fix their numbers fast.</Text>
      </View>

      <View style={s.divider} />
      <Text style={[s.body, { textAlign: 'center', marginTop: 20 }]}>
        Visit foundersroi.com/pricing to upgrade
      </Text>
      <Text style={s.muted} render={({ pageNumber }) => `${pageNumber} / 12`} fixed />
    </Page>
  );
}

// ── MAIN DOCUMENT ASSEMBLER ─────────────────────────────────

/**
 * PdfReport — The complete 12-page FoundersROI report document.
 *
 * @param {Object} data
 * @param {Object} data.fsiResult     — output of calculateFSI()
 * @param {Object} data.reportContent — output of generateAIReport() or generateTemplateReport()
 * @param {Object} data.formData      — original user inputs
 */
const PdfReport = ({ fsiResult = {}, reportContent = {}, formData = {} }) => {
  const {
    score = 0,
    band = 'Unknown',
    color = COLORS.muted,
    emoji = '❓',
    description = '',
    ohShitMoment = '',
    diagnosticLabel,
    metricBreakdown = [],
  } = fsiResult;

  const {
    survivalStory = '',
    top3Leaks = [],
    top3QuickWins = [],
    thirtyDayPlan = [],
    sixtyNinetyDayPlan = [],
    investorPerception = '',
    industryBenchmarks = [],
  } = reportContent;

  const companyName = formData.companyName || 'My Startup';
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <Document
      title={`${companyName} — Survival Score Report`}
      author="FoundersROI"
      subject={`FSI Score: ${score}/100 — ${band}`}
    >
      {/* Page 1 */}
      <PdfCover companyName={companyName} score={score} band={band} color={color} emoji={emoji} date={date} />
      {/* Page 2 */}
      <PdfOhShitMoment ohShitMoment={ohShitMoment} survivalStory={survivalStory} diagnosticLabel={diagnosticLabel} />
      {/* Page 3 */}
      <PdfScoreVisual score={score} band={band} color={color} emoji={emoji} description={description} metricBreakdown={metricBreakdown} />
      {/* Page 4 */}
      <PdfMetricGrid metricBreakdown={metricBreakdown} />
      {/* Page 5 */}
      <PdfBenchmarks industryBenchmarks={industryBenchmarks} />
      {/* Page 6 */}
      <PdfLeaks top3Leaks={top3Leaks} />
      {/* Page 7 */}
      <PdfQuickWins top3QuickWins={top3QuickWins} />
      {/* Page 8 */}
      <PdfRecoveryPlan thirtyDayPlan={thirtyDayPlan} />
      {/* Page 9 */}
      <PdfGrowthPlan sixtyNinetyDayPlan={sixtyNinetyDayPlan} />
      {/* Page 10 */}
      <PdfInvestorView investorPerception={investorPerception} score={score} band={band} emoji={emoji} />
      {/* Page 11 */}
      <PdfBadge companyName={companyName} score={score} band={band} color={color} emoji={emoji} />
      {/* Page 12 */}
      <PdfUpsell score={score} band={band} />
    </Document>
  );
};

// ── PDF Generator (non-React rendering helper) ──────────────

/**
 * Generate a PDF blob from report data. Uses @react-pdf/renderer's pdf() function.
 * Call this outside React render cycle (e.g., in an async handler).
 *
 * @param {Object} params
 * @param {Object} params.fsiResult     — FSI engine output
 * @param {Object} params.reportContent — AI or template report content
 * @param {Object} params.formData      — original form inputs
 * @returns {Promise<Blob>} PDF blob ready for download or email attachment
 */
export async function generatePdfBlob({ fsiResult, reportContent, formData }) {
  // Dynamic import to avoid bundling @react-pdf/renderer into main chunk unnecessarily
  const { pdf } = await import('@react-pdf/renderer');

  const doc = <PdfReport fsiResult={fsiResult} reportContent={reportContent} formData={formData} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Trigger a PDF download in the browser.
 */
export async function downloadPdf({ fsiResult, reportContent, formData, filename }) {
  const blob = await generatePdfBlob({ fsiResult, reportContent, formData });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `FoundersROI-Survival-Report-${fsiResult?.score || 'XX'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { PdfReport };
export default PdfReport;
