import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Shield, Lock, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BlurredReport from '@/components/BlurredReport.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>FoundersROI — The AI Startup Truth Engine</title>
        <meta name="description" content="Is your startup going to survive? Get your AI-powered Survival Score in 60 seconds and know exactly what to fix before it's too late." />
      </Helmet>

      <div className="min-h-screen bg-background selection:bg-primary/30">
        <Header />

        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col justify-center section-padding overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 hero-grid" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-sm font-medium mb-4"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                The Truth Engine for Founders
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
              >
                Is Your Startup Going to <span className="gradient-text">Survive?</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto"
              >
                Get your AI-powered Survival Score in 60 seconds — and know exactly what to fix before it's too late.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                <Link to="/score" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto py-7 px-8 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300">
                    Get My Free Survival Score <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto py-7 px-8 text-lg bg-secondary/50 backdrop-blur-sm hover:bg-secondary">
                    View Pricing
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground font-medium"
              >
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> NDA Available</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Data Strictly Private</span>
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> 60-Second Results</span>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SURVIVAL BANDS SECTION */}
        <section className="section-padding bg-secondary/30 border-y border-border">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Do You Stand?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our deterministic engine calculates your exact position across 5 survival bands based on your real financials.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
              {[
                { band: 'Critical', score: '0-30', icon: '🔴', color: 'band-critical', desc: 'Immediate intervention needed' },
                { band: 'Struggling', score: '31-50', icon: '🟠', color: 'band-struggling', desc: 'Serious leaks present' },
                { band: 'Stable', score: '51-65', icon: '🟡', color: 'band-stable', desc: 'Fixable with clear guidance' },
                { band: 'Growing', score: '66-85', icon: '🟢', color: 'band-growing', desc: 'Investor-fundable path' },
                { band: 'Investor Grade', score: '86-100', icon: '🚀', color: 'band-investor', desc: 'Ready to raise' }
              ].map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex-1 p-5 rounded-xl border border-border bg-card flex flex-col items-center text-center hover:border-${b.color} transition-colors`}
                >
                  <span className="text-4xl mb-3">{b.icon}</span>
                  <h4 className="font-bold mb-1">{b.band}</h4>
                  <span className={`text-xs font-bold text-${b.color} mb-3`}>{b.score} PTS</span>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="section-padding relative">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">No Fluff. Just Math.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to uncover the brutal truth about your startup's financial health.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Tell us your stage', desc: 'Select your funding stage and biggest current worry.', icon: '🏢' },
                { step: '02', title: 'Enter your metrics', desc: 'Input 5 core numbers: Burn, Revenue, Cash, CAC, and LTV.', icon: '📊' },
                { step: '03', title: 'Get your score', desc: 'Instantly receive your Survival Score, band, and diagnosis.', icon: '🎯' }
              ].map((s, i) => (
                <div key={i} className="relative p-8 rounded-2xl glass-card">
                  <span className="absolute -top-6 -right-2 text-8xl font-black text-primary/5 select-none">{s.step}</span>
                  <span className="text-4xl mb-6 block">{s.icon}</span>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/score">
                <Button className="py-6 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Your Free Scan
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* REPORT PREVIEW SECTION */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Go Beyond the Score</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  The free scan gives you your score. The paid audit gives you the exact playbook to fix it. Get a 12-page AI narrative report delivered to your inbox in 24 hours.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Your exact "Oh Sh*t Moment" identified',
                    'Top 3 biggest financial leaks',
                    '30-Day actionable recovery plan',
                    'Investor perception analysis'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button variant="outline" className="py-6 px-8 text-base border-border hover:bg-secondary">
                    View Audit Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                <BlurredReport />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Is the Survival Score really free?", a: "Yes. The score, band, and high-level diagnosis are 100% free. You only pay if you want the deep-dive 12-page AI audit report." },
                { q: "How is the score calculated?", a: "We use a deterministic 100-point formula weighting 5 metrics: Runway (25%), Burn Multiple (20%), CAC:LTV (20%), Churn (20%), and Revenue Momentum (15%). No AI guessing, just pure financial reality." },
                { q: "Do you keep my financial data?", a: "No. The calculator runs entirely in your browser. We only save your email and high-level score band if you opt-in to the full report. NDA is available upon request for paid audits." },
                { q: "Do I have to get on a sales call?", a: "Never. We operate a 100% async model. You get your PDF report and a personalized Loom video walkthrough. You watch it on your own time. No sales pressure." }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card">
                  <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Stop Guessing. Know Your Truth.</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Takes 60 seconds. Could save your company years of pain.
            </p>
            <Link to="/score">
              <Button className="py-7 px-10 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300">
                Calculate My Score Now
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
