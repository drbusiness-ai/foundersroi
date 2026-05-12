
🚀 FoundersROI — Complete Product Documentation Suite
I've read your entire GitHub repo (drbusiness-ai/foundersroi) and both previous chat files. Here is the full PRD, TRD, UI/UX Design, Appflow, Backend Schema, and Implementation Plan — all in one place.Read-this-previous-chat-properly-to-get-the-contex.md+1

📌 EXECUTIVE OVERVIEW
FoundersROI (foundersroi.com) is the "AI Startup Truth Engine" — a fully async, no-call B2B SaaS service that gives startup founders a deterministic Founder Survival Index (FSI) Score and a 12-15 page AI-generated diagnostic report. The product was pivoted from a basic ROI calculator to a "Certainty Engine" — selling not ROI numbers, but founder survival certainty.Ye-thread-last-chat-ka-hai-isko-ache-se-read-karo.md

📄 SECTION 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)
Product Vision
Tagline: "Is Your Startup Going to Survive?"Positioning: World's first AI Startup Truth Engine — not a calculator, not a consultant. A diagnostic machine.
Target Users

User Segment	Profile	Pain Point
Primary	Seed-Series A startup founders	Don't know their real financial health
Secondary	Bootstrapped founders	Fear of running out of runway silently
Tertiary	Accelerator managers	Need portfolio health checks at scale
Core User Problem
Founders have financial anxiety but no objective benchmark. They need a fast, private, honest diagnosis — not a consultant pitch call.Ye-thread-last-chat-ka-hai-isko-ache-se-read-karo.md
Offer Stack (Locked)

Tier	Name	Price	Delivery	Turnaround
L1	AI Survival Scan	$49	Automated 8-10pg PDF	Instant
L2	Founder Truth Audit	$297	12-15pg PDF + Loom video	24 hours
L3	Runway Recovery Sprint	$2,497	5-week async program	5 weeks
L4	Portfolio Intelligence Pack	$4,997	10 audits, white-label	72 hours
Decision locked: Zero calls, zero scheduling — 100% async delivery.
FSI Score System
The Founder Survival Index score is deterministic (no AI):
* Runway Score (25%): Cash / Monthly Burn normalized to 18 months = 100
* Burn Multiple (20%): Net Burn / Net New ARR — <1x perfect, >5x = zero
* CAC/LTV Ratio (20%): LTV / CAC — 3x = perfect
* Churn Score (20%): Monthly churn vs benchmark — <2% = perfect
* Revenue Momentum (15%): Revenue / Burn — 2x = perfect
Score Bands:

Score	Band	Color	Meaning
0–30	🔴 Critical	#EF4444	Immediate intervention
31–50	🟠 Fragile	#F97316	Serious leaks
51–70	🟡 Stable	#EAB308	Fixable with guidance
71–85	🟢 Strong	#22C55E	Investor-fundable path visible
86–100	🚀 Investor Grade	#8B5CF6	Ready to raise
Key Features (Phase 1)
* 3-step conversational intake form
* Real-time FSI score calculation (client-side, offline-capable)
* Email gate (score visible, full breakdown locked)
* Shareable score badge (PNG via html2canvas)
* Blurred sample report teaser
* PWA install capability
* 4-tier pricing page
Key Features (Phase 2)
* DeepSeek V4 Pro AI narrative generation
* Automated PDF report generation
* Make.com automation pipeline
* Email delivery automation
* OpenClaw backend on Hostinger VPS

⚙️ SECTION 2 — TECHNICAL REQUIREMENTS DOCUMENT (TRD)
Tech Stack

Layer	Technology	Reason
Frontend	Vite + React 18 + TailwindCSS	Existing codebase, fast build
UI Components	Radix UI + shadcn	Already installed
Animations	Framer Motion	Already installed
Routing	react-router-dom v6	Already installed
PWA	vite-plugin-pwa + Workbox	Adds service worker, offline
Badge Generation	html2canvas	PNG score card export
Backend (Phase 1)	PocketBase	Email capture only
Backend (Phase 2)	OpenClaw on Hostinger VPS (Docker)	AI pipeline
AI (Phase 2)	DeepSeek V4 Pro API	91% cheaper than GPT-4o
Automation	Make.com	Form → AI → PDF → Email
Payments	Stripe (USD global) + Razorpay (INR India)	Dual market
Deployment	Vercel (frontend) + Hostinger VPS (backend)	Optimal split
Email	Brevo (hello@foundersroi.com)	Cold outreach + delivery
Lead Gen	Apollo.io	Founder ICP prospecting
Repository Structure

text
drbusiness-ai/foundersroi (GitHub)
├── apps/
│   ├── web/                    ← React SPA (main frontend)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── SurvivalScorePage.jsx  ← NEW
│   │   │   │   ├── ScoreResultPage.jsx    ← NEW
│   │   │   │   ├── PricingPage.jsx
│   │   │   │   ├── ContactPage.jsx
│   │   │   │   ├── PrivacyPolicy.jsx
│   │   │   │   └── Terms.jsx
│   │   │   ├── components/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── fsiEngine.js           ← CORE
│   │   │   │   ├── SurvivalBadge.jsx
│   │   │   │   ├── EmailGateModal.jsx
│   │   │   │   ├── ScoreDisplay.jsx
│   │   │   │   ├── MetricInput.jsx
│   │   │   │   ├── ConversationalStep.jsx
│   │   │   │   ├── BlurredReport.jsx
│   │   │   │   └── InstallPrompt.jsx
│   │   │   └── App.jsx
│   │   ├── public/
│   │   │   ├── manifest.json
│   │   │   ├── sw.js
│   │   │   └── icons/
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── tailwind.config.js
│   └── pocketbase/             ← Phase 1 backend
├── FoundersROI_Final_Architecture_v2.md
└── package.json
Performance Requirements
* Lighthouse PWA score: ≥ 90
* First Contentful Paint: < 1.5s
* FSI calculation: < 50ms (pure JS, no API)
* Offline capability: Full score page works without network
* Mobile breakpoint primary: 375px
Security Requirements
* No founder financial data stored server-side in Phase 1
* PocketBase stores: email, FSI score, band, stage, timestamp only
* All Stripe payment links open in _blank
* HTTPS enforced via Vercel
* No API keys in frontend bundle
Dependencies to Install

bash
npm install html2canvas vite-plugin-pwa workbox-precaching workbox-routing

🎨 SECTION 3 — UI/UX DESIGN SPECIFICATION
Design System

Token	Value
Background	Dark (#0a0a0f)
Primary Purple	hsl(262, 83%, 58%) = #7c3aed approx
Font	DM Sans (Google Fonts)
Border Radius	0.75rem (cards), 0.5rem (buttons)
Glassmorphism	backdrop-filter: blur(12px); background: rgba(255,255,255,0.05)
Page-by-Page UI Spec
Homepage (/)

text
┌─────────────────────────────────────────┐
│  HEADER: Logo | Home | Score | Pricing   │
│          Contact          [Get Free Score]│
├─────────────────────────────────────────┤
│  HERO SECTION                            │
│  "Is Your Startup Going to Survive?"    │
│  Sub: "Get your AI-powered Survival     │
│        Score in 60 seconds"             │
│  [Get My Free Survival Score →]         │
│  Trust badges: 🔒 NDA | ⚡ 60sec | 🔐 Private │
│  Animated particle background           │
├─────────────────────────────────────────┤
│  SHOCK LINE (below hero, above bands)   │
│  "Most founders discover a financial    │
│   leak that could cut runway in half —  │
│   within minutes of taking the scan."   │
├─────────────────────────────────────────┤
│  SURVIVAL BANDS VISUAL                  │
│  [🔴 Critical] [🟠 Fragile] [🟡 Stable] │
│  [🟢 Strong]   [🚀 Investor Grade]      │
├─────────────────────────────────────────┤
│  HOW IT WORKS (3 steps, icons)          │
│  1. Tell Your Stage  2. Share Worry     │
│  3. Enter Metrics → Get Score           │
├─────────────────────────────────────────┤
│  SAMPLE REPORT (blurred glassmorphism)  │
│  [Unlock Full Report →]                 │
├─────────────────────────────────────────┤
│  PRICING SECTION (inline)               │
│  $49 | $297 [MOST POPULAR] | $2,497     │
├─────────────────────────────────────────┤
│  FAQ ACCORDION (5-7 questions)          │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
Survival Score Page (/score)

text
Step 1 — Stage Selection
┌─────────────────────────────────────────┐
│  Step 1 of 3  ████░░░░░░               │
│  "What stage is your startup?"          │
│                                         │
│  [🌱 Pre-revenue]  [🌿 Seed]           │
│  [🚀 Series A]     [💎 Series B+]      │
│  [⚡ Bootstrapped]                      │
│                              [Next →]   │
└─────────────────────────────────────────┘

Step 2 — Worry Selection (Multi-select)
┌─────────────────────────────────────────┐
│  Step 2 of 3  ████████░░               │
│  "What keeps you up at night?"          │
│                                         │
│  ☐ Running out of money                 │
│  ☐ Can't acquire customers cheaply     │
│  ☐ Customers keep leaving              │
│  ☐ Margins too thin                    │
│  ☐ All of the above                    │
│                              [Next →]   │
└─────────────────────────────────────────┘

Step 3 — Metrics Input
┌─────────────────────────────────────────┐
│  Step 3 of 3  ████████████             │
│  "Let's see the real numbers"           │
│                                         │
│  Monthly Revenue  [$________] ⓘ       │
│  Monthly Burn     [$________] ⓘ       │
│  Cash in Bank     [$________] ⓘ       │
│  CAC              [$________] ⓘ       │
│  Average LTV      [$________] ⓘ       │
│  Monthly Churn    [_______]% ⓘ       │
│  Team Size        [________]           │
│  Business Model   [Dropdown ▼]         │
│                                         │
│              [Calculate My Score →]    │
└─────────────────────────────────────────┘

Score Output
┌─────────────────────────────────────────┐
│         72                              │
│      ╱‾‾‾‾‾╲   SURVIVAL SCORE          │
│     │  /100 │                           │
│      ╲_____╱                            │
│                                         │
│  🟢  STRONG                             │
│  "Fix CAC before scaling ads"           │
│                                         │
│  ────── EMAIL GATE MODAL ──────        │
│  [Enter email to unlock full analysis] │
│  [___________email____________]         │
│  [Unlock Full Analysis →]              │
└─────────────────────────────────────────┘

Post-Email: Full Breakdown + Share Badge
Pricing Page (/pricing)

text
┌─────────────────────────────────────────┐
│  "Choose Your Survival Plan"            │
│  "100% Async. No calls. Ever."          │
├────────┬────────┬────────┬─────────────┤
│  $49   │  $297  │  $997  │   $2,497    │
│ Scan   │ Audit  │ Triage │   Sprint    │
│Instant │ 24hr   │ 24hr   │   5-week   │
│ [CTA]  │[★ CTA] │ [CTA]  │   [CTA]    │
├────────┴────────┴────────┴─────────────┤
│  COMPARISON TABLE (features vs tiers)  │
├─────────────────────────────────────────┤
│  "No Calls. Ever." trust block          │
└─────────────────────────────────────────┘
Mobile-First Rules
* All tap targets: min 44×44px
* Font sizes: min 16px on inputs (prevents iOS zoom)
* Hamburger menu: visible at < 768px
* Form steps: full-width cards at 375px
* Score display: centered, 120px font size minimum

🔄 SECTION 4 — APP FLOW (COMPLETE USER JOURNEY)
Visitor to Score Flow

text
User lands on foundersroi.com
        │
        ▼
    Homepage (/)
        │ Clicks "Get My Free Survival Score"
        ▼
    /score — Step 1
    Selects startup stage (single-select cards)
        │ Clicks Next
        ▼
    /score — Step 2
    Selects worries (multi-select)
        │ Clicks Next
        ▼
    /score — Step 3
    Enters financial metrics
        │ Clicks "Calculate My Score"
        ▼
    fsiEngine.js runs client-side
    (No API call — instant, works offline)
        │
        ▼
    Score Output Appears
    (Score + Band visible immediately)
        │
        ▼
    EMAIL GATE MODAL
    Detailed breakdown blurred
        │ User enters email
        ▼
    Email saved to PocketBase
        │
        ▼
    Full breakdown revealed
    + Share Badge shown
        │
        ▼
    User downloads PNG / shares to LinkedIn
        │
        ▼
    CTA to /pricing → Stripe payment
Payment to Delivery Flow (Phase 2)

text
User pays on Stripe
        │
        ▼
Stripe webhook → Make.com
        │
        ▼
Make.com reads PocketBase lead data
        │
        ▼
OpenClaw (Hostinger VPS) receives payload
        │
        ▼
DeepSeek V4 Pro API call
→ Generates: Oh Sh*t Moment, Top 3 Leaks,
  Quick Wins, 30-Day Plan, Investor Perception
        │
        ▼
Google Docs template auto-filled
        │
        ▼
PDF exported to Google Drive
        │
        ▼
You notified via Slack/Email (5min review)
        │ (L2 only) Record 10min Loom
        ▼
Brevo email sent to founder
→ PDF link + Loom link + Score card PNG
→ Upsell CTA to Sprint
Cold Outreach Flow (Phase 3)

text
Apollo.io → Export 100 founders/day (ICP: Seed-Series A, SaaS/Tech CEOs)
        │
        ▼
Instantly.ai cold email (30-50/day)
Subject: "Is Your Startup Going To Survive?"
        │
        ▼
Founder visits foundersroi.com/score
        │
        ▼
[Same Score → Email Gate → Purchase flow]

🗃️ SECTION 5 — BACKEND SCHEMA
Phase 1: PocketBase Schema
Collection: leads

Field	Type	Required	Notes
id	Auto	—	PocketBase auto-ID
email	Email	✅	Unique
fsi_score	Number	✅	0–100
survival_band	Text	✅	Critical/Fragile/Stable/Strong/Investor Grade
startup_stage	Text	✅	Pre-revenue/Seed/Series A/Series B+/Bootstrapped
worries	JSON	❌	Array of selected worries
monthly_revenue	Number	❌	$
monthly_burn	Number	❌	$
cash_in_bank	Number	❌	$
cac	Number	❌	$
ltv	Number	❌	$
monthly_churn	Number	❌	%
team_size	Number	❌	Integer
business_model	Text	❌	SaaS/Ecommerce/Marketplace/Services/Other
submitted_at	DateTime	Auto	Auto timestamp
payment_tier	Text	❌	null/L1/L2/L3/L4
payment_status	Text	❌	pending/paid
report_delivered	Boolean	❌	Default false
Collection: score_shares

Field	Type	Notes
id	Auto	
lead_id	Relation → leads	FK
share_token	Text	Unique URL token
company_name	Text	From form input
score	Number	Snapshot
band	Text	Snapshot
created_at	DateTime	Auto
Phase 2: OpenClaw / API Schema
Webhook Payload (Make.com → OpenClaw)

json
{
  "lead_id": "abc123",
  "email": "founder@startup.com",
  "tier": "L2",
  "metrics": {
    "monthly_revenue": 15000,
    "monthly_burn": 22000,
    "cash_in_bank": 180000,
    "cac": 450,
    "ltv": 1200,
    "monthly_churn": 4.5,
    "team_size": 7,
    "business_model": "SaaS"
  },
  "fsi_score": 62,
  "survival_band": "Stable",
  "startup_stage": "Seed",
  "worries": ["Running out of money", "Customers keep leaving"]
}
DeepSeek Prompt Output Schema

json
{
  "oh_shit_moment": "string (1 sentence, brutal truth)",
  "top_3_leaks": ["string", "string", "string"],
  "top_3_quick_wins": ["string", "string", "string"],
  "30_day_plan": "string (week by week)",
  "60_90_day_plan": "string",
  "investor_perception": "string (2-3 sentences)",
  "survival_story": "string (2 sentences)"
}
LLM Cost Per Report

Use Case	Model	Cost
Full narrative	DeepSeek V4 Pro	~$0.03
Investor perception	Claude Sonnet	~$0.008
Cold email personalization	GPT-4o-mini	~$0.001
Total per audit		~$0.04
🗺️ SECTION 6 — IMPLEMENTATION PLAN (STEP-BY-STEP)
Phase 1 — Frontend PWA (Status: In Progress / QA Needed)
Goal: Fully functional score page, email gate, share badge, live on foundersroi.com

Step	Task	Owner	Status
1.1	fsiEngine.js — all 5 weighted metrics	Antigravity	✅ Done
1.2	SurvivalScorePage.jsx — 3-step form	Antigravity	✅ Done
1.3	HomePage.jsx — full rewrite	Antigravity	✅ Done
1.4	PricingPage.jsx — USD tiers	Antigravity	✅ Done
1.5	EmailGateModal.jsx — PocketBase submit	Antigravity	✅ Done
1.6	SurvivalBadge.jsx — html2canvas PNG	Antigravity	✅ Done
1.7	PWA manifest + service worker	Antigravity	✅ Done
1.8	Jules QA bug fix run	Jules	⏳ Pending
1.9	Stripe real links replace placeholders	You	⏳ Pending
1.10	Cold email campaign (25 founders, Brevo)	You	✅ Launched
1.11	Apollo CSV → Brevo list	You	✅ Done
Phase 2 — Backend AI Pipeline (Next Priority)
Goal: Automated report generation, PDF delivery, Make.com workflow

Step	Task	Owner	Timeline
2.1	Stripe account + real payment links	You	Week 1
2.2	OpenClaw Docker setup on Hostinger VPS	You + Antigravity	Week 1
2.3	DeepSeek V4 Pro API key setup	You	Week 1
2.4	Make.com webhook: Stripe → PocketBase → OpenClaw	Antigravity	Week 2
2.5	Google Docs 12-page report template	You	Week 2
2.6	Auto-PDF generation and Drive upload	Antigravity	Week 2
2.7	Brevo transactional email (report delivery)	You	Week 2
2.8	End-to-end test: pay → auto-report → email	Both	Week 2
2.9	Nexos.ai API key management setup	You	Week 3
2.10	L2 Loom video workflow (manual but templated)	You	Week 3
Phase 3 — Outbound + Content (Days 31–60)

Step	Task	Timeline
3.1	Instantly.ai cold email setup (30-50/day)	Day 31
3.2	LinkedIn "Startup Autopsy" series (daily)	Day 31
3.3	Apollo.io scale to 100 leads/day	Day 35
3.4	Reddit posts (r/startups, r/SaaS)	Day 33
3.5	ProductHunt launch preparation	Day 44-45
3.6	ProductHunt launch day	Day 45
3.7	Accelerator outreach (Y Combinator, Techstars, 100X.VC, Blume)	Day 50
3.8	First cohort deal target ($1,970 for 10 founders)	Day 60
Phase 4 — Scale & Automation (Days 61–90)

Step	Task	Timeline
4.1	White-label PDF template for L4 portfolio clients	Day 61
4.2	Language switching (EN/HI) for India market	Day 65
4.3	Clay.com for deep lead enrichment	Day 70
4.4	Testimonials collected → Social proof on site	Day 63
4.5	Price bump: $297 → $397 Audit (after 5 testimonials)	Day 70
4.6	Add optional 15-min kickoff call for $2,497 Sprint tier	Day 75
4.7	₹2.5 Cr trajectory: 2-3 accelerator cohort deals	Month 5-7
Revenue Milestone Tracker

Phase	Days	Target Revenue
Phase 0-1	1–7	$0–500 (beta audits)
Phase 2	8–30	$2K–6K (~₹1.7–5L)
Phase 3A	31–60	$8K–20K (~₹7–17L)
Phase 3B	61–90	$20K–60K (~₹17–50L)
Phase 4	91–150	$80K–200K (~₹67L–1.7Cr)
₹2.5 Cr path	Month 5–7	2-3 accelerator deals
🔑 IMMEDIATE NEXT ACTIONS (Today)
Based on where you left off in the previous chats:Read-this-previous-chat-properly-to-get-the-contex.md+1
1. Run Jules QA prompt on drbusiness-ai/foundersroi — give Jules the full QA checklist from your previous chat
2. Get Stripe account + create 4 payment links — replace #stripe-l1, #stripe-l2, #stripe-l3, #stripe-l4 in code
3. Monitor Brevo cold email campaign — 25 founders were just emailed, check opens/clicks in 24 hours
4. Set up OpenClaw on Hostinger VPS — Phase 2 pipeline needs this as the first step
5. Record 1 sample Loom video using fake "TechCo Inc" data — use as demo for site
The single most important rule from your own architecture doc : "Sell first. Build parallel. Send 5 DMs for free audits TODAY — even before the landing page is perfect. Your first paying customer validates everything. Architecture documents validate nothing."
