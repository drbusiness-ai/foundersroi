import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Link } from 'react-router-dom';

const BlurredReport = () => {
  const reportPages = [
    { title: 'Cover Page', content: 'TechCo Inc. — Survival Score: 72/100 — Growing — May 2026' },
    { title: 'The "Oh Sh*t Moment"', content: 'At your current burn rate, you have 6.3 months before serious runway pressure — and your CAC is 4.2x your LTV, meaning you lose money on every customer you acquire right now.' },
    { title: 'Score Breakdown', content: 'Runway: 58/100 • Burn Multiple: 72/100 • LTV:CAC: 45/100 • Churn: 85/100 • Revenue Momentum: 68/100' },
    { title: 'Top 3 Biggest Leaks', content: '1. CAC exceeding LTV by 4.2x — unsustainable growth\n2. Runway at 6.3 months — below 12-month safety threshold\n3. Burn multiple at 2.8x — spending nearly $3 for every $1 of new revenue' },
    { title: '30-Day Recovery Plan', content: 'Week 1: Audit all paid acquisition channels, cut anything with CAC > $200\nWeek 2: Implement onboarding sequence to reduce churn by 15%\nWeek 3: Negotiate extended payment terms with top 3 vendors' },
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Report Preview Cards */}
      <div className="grid gap-4">
        {reportPages.map((page, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`rounded-xl border border-border bg-card p-5 sm:p-6 ${i > 0 ? 'report-blur' : ''}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground font-mono">
                Page {i + 1}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h4 className="text-base font-semibold mb-2">{page.title}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {page.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ top: '30%' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card-strong rounded-2xl p-6 sm:p-8 text-center max-w-sm mx-4"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-2">Get Your Full Report</h3>
          <p className="text-sm text-muted-foreground mb-5">
            12-page AI-powered diagnostic with actionable recovery plan
          </p>
          <Link to="/pricing">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 text-base font-semibold">
              View Pricing — From $49
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlurredReport;
