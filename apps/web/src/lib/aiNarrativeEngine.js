/**
 * aiNarrativeEngine.js — GPT-4o powered report narrative generator.
 *
 * Takes FSI results + founder inputs, calls OpenAI GPT-4o with structured
 * prompt chains, and returns formatted report sections. Falls back to
 * template-based content (reportSections.js) if the API call fails or if
 * no API key is provided.
 *
 * Usage:
 *   import { generateAIReport } from './aiNarrativeEngine.js';
 *   const report = await generateAIReport({ apiKey, fsiResult, formData });
 *
 * Cost: ~$0.015 per report with GPT-4o (~800 input tokens, ~2000 output)
 */

import { generateTemplateReport } from './reportSections.js';

// ── Prompt Templates ────────────────────────────────────────

const SYSTEM_PROMPT = `You are a startup financial diagnostician. You analyze startup metrics and produce clear, brutally honest reports for founders. Your tone is direct, data-backed, and actionable — never fluff, never sugar-coating.

Rules:
1. Every claim must reference a specific number from the founder's data
2. Use the founder's company name when provided
3. Output ONLY valid JSON matching the exact schema provided
4. Write in the founder's language — be human, not academic
5. Each section must stand alone (founders often skim)`;

function buildUserPrompt(fsiResult, formData) {
  const { score, band, emoji, description, ohShitMoment, metricBreakdown, runwayMonths } = fsiResult;
  const name = formData.companyName || 'the startup';
  const stage = formData.stage || 'Not specified';
  const model = formData.businessModel || 'Not specified';
  const worries = (formData.worry || []).join(', ') || 'None specified';

  return `Analyze this startup and produce a JSON report:

COMPANY: ${name}
STAGE: ${stage}
BUSINESS MODEL: ${model}
FOUNDER WORRIES: ${worries}

FSI SURVIVAL SCORE: ${score}/100
BAND: ${emoji} ${band} — ${description}
RUNWAY: ${runwayMonths} months

OH SH*T MOMENT (deterministic): "${ohShitMoment}"

METRIC BREAKDOWN:
${metricBreakdown.map(m => `  - ${m.label}: ${m.value}${m.unit} → Score ${m.score}/100 (Healthy: ${m.benchmark.good}${m.unit})`).join('\n')}

Return exactly this JSON structure:
{
  "survivalStory": "2-3 sentence narrative. Include the score, what it means for their stage, and the most urgent takeaway. Reference specific numbers.",
  "top3Leaks": [
    {
      "title": "Leak #1: [Metric Name]",
      "diagnosis": "Specific diagnosis tied to their actual numbers. Why this metric is hurting them.",
      "impact": "What this leak means for their runway, fundraising ability, or survival odds."
    }
  ],
  "top3QuickWins": [
    {
      "action": "Specific, actionable step",
      "expectedOutcome": "Quantifiable expected result tied to their numbers",
      "timeline": "e.g. 0-30 Days"
    }
  ],
  "thirtyDayPlan": [
    {
      "week": "Week 1",
      "focus": "Main focus area",
      "actions": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "sixtyNinetyDayPlan": [
    {
      "milestone": "Month 2 — [Goal]",
      "actions": ["Action 1", "Action 2"]
    }
  ],
  "investorPerception": "2-3 sentences on how a VC would interpret these numbers at their current stage. Reference their actual score and band."
}`;
}

// ── API Call ────────────────────────────────────────────────

async function callOpenAI(apiKey, systemPrompt, userPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  return JSON.parse(content);
}

// ── Main Export ────────────────────────────────────────────

/**
 * Generate a complete AI-powered report. Falls back to template report
 * if API key is missing or the API call fails.
 *
 * @param {Object} options
 * @param {string} options.apiKey       — OpenAI API key (sk-...)
 * @param {Object} options.fsiResult    — output of calculateFSI()
 * @param {Object} options.formData     — user's form inputs
 * @param {number} [options.timeoutMs]  — max wait for API (default 15000)
 * @returns {Promise<Object>} report sections
 */
export async function generateAIReport({ apiKey, fsiResult, formData = {}, timeoutMs = 15000 }) {
  // No API key → use template fallback
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    console.warn('[aiNarrativeEngine] No valid OpenAI API key — using template fallback');
    return generateTemplateReport(fsiResult, formData);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const userPrompt = buildUserPrompt(fsiResult, formData);

    const aiContent = await callOpenAI(apiKey, SYSTEM_PROMPT, userPrompt);

    clearTimeout(timeout);

    return {
      source: 'gpt-4o',
      ...aiContent,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[aiNarrativeEngine] GPT-4o call failed, falling back to template:', err.message);
    return {
      ...generateTemplateReport(fsiResult, formData),
      source: 'template-fallback',
      fallbackReason: err.message,
    };
  }
}

export default generateAIReport;
