import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PricingPage = () => {
  return (
    <>
      <Helmet>
        <title>Pricing | FoundersROI</title>
        <meta name="description" content="Choose your Startup Truth Audit. No calls. Fully async delivery." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="section-padding relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 hero-grid pointer-events-none" />
          
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-sm font-medium mb-4">
                <span className="text-primary">⚡️</span> 100% Async Delivery
              </div>
              <h1 className="mb-4 text-4xl md:text-5xl font-bold">The Truth.</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                Select your level of analysis. Delivered directly to your inbox. 100% async delivery. No sales calls, ever.
              </p>
              <p className="text-md text-foreground font-medium max-w-2xl mx-auto">
                Most founders discover a financial leak that could cut their runway in half — within minutes of taking the scan.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              
              {/* Tier 1: Self-Serve */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex"
              >
                <Card className="w-full bg-card border-border flex flex-col hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground font-medium">AI Survival Scan</CardTitle>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold">$49</span>
                      <span className="text-muted-foreground text-sm ml-2">USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Automated diagnostic report</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {['Instant Delivery', 'Automated 8-page PDF report', 'Metric-by-metric breakdown', 'Top 3 Biggest Leaks identified', 'Shareable Score Badge'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-6 border-t border-border/50">
                    <a href="#stripe-l1" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="w-full py-6 text-base border-primary/50 hover:bg-primary/10">
                        Get Instant Scan
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Tier 2: Full Audit (Most Popular) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex relative scale-100 lg:scale-105 z-10"
              >
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-primary/20">
                    Most Popular
                  </span>
                </div>
                <Card className="w-full bg-secondary border-primary/50 ring-2 ring-primary/20 flex flex-col shadow-2xl shadow-primary/10">
                  <CardHeader className="pt-8">
                    <CardTitle className="text-xl text-primary font-medium">Founder Truth Audit</CardTitle>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold text-secondary-foreground">$297</span>
                      <span className="text-secondary-foreground/70 text-sm ml-2">USD</span>
                    </div>
                    <p className="text-sm text-secondary-foreground/80">Deep dive analysis + Video</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mb-4 leading-relaxed">
                      See exactly how an investor would judge your numbers.
                    </p>
                    <ul className="space-y-4">
                      {['24-Hour Delivery via Email', '12-15 page AI + Human reviewed PDF', 'Personalized Loom video walkthrough', '30-Day step-by-step Recovery Plan', 'Investor Perception Analysis', 'Everything in AI Survival Scan'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-secondary-foreground/90 font-medium">
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-6 border-t border-border/30">
                    <a href="#stripe-l2" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base transition-all duration-200 active:scale-[0.98] glow-primary font-bold">
                        Get Full Audit — $297
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Tier 3: Runway Recovery Sprint */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex"
              >
                <Card className="w-full bg-card border-border flex flex-col hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground font-medium">Runway Recovery Sprint</CardTitle>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold">$997</span>
                      <span className="text-muted-foreground text-sm ml-2">USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">5-week async program</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {['5 Weeks of guided execution', 'Weekly AI Truth Report + Loom video', 'Unlimited async Q&A via email/Slack', 'Everything in Full Audit'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-6 border-t border-border/50">
                    <a href="#stripe-l3" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="w-full py-6 text-base border-primary/50 hover:bg-primary/10">
                        Start Sprint Program
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Tier 4: Portfolio Pack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex"
              >
                <Card className="w-full bg-card border-border flex flex-col hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground font-medium">Portfolio Pack</CardTitle>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold">$2,497</span>
                      <span className="text-muted-foreground text-sm ml-2">USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">10 audits, white-label</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {['Best for agencies/platforms', '10 Founder Truth Audits included', 'White-labeled PDF reports', 'Bulk discount applied', 'Priority delivery SLA'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-6 border-t border-border/50">
                    <a href="#stripe-l4" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="w-full py-6 text-base border-border hover:bg-secondary">
                        Get Portfolio Pack
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>

            </div>

            {/* Trust Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-6 py-3 rounded-full border border-border">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">All founder data is kept strictly confidential. NDA available on request.</span>
              </div>
            </motion.div>

          </div>
        </section>

        {/* TRUST & DIFFERENTIATION SECTION */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">No Calls. Ever. 100% Async Delivery.</h2>
              <p className="text-lg text-muted-foreground mb-12">
                We know you're busy running a company. You don't have time for discovery calls or high-pressure sales pitches. Our entire process is designed for maximum insight with minimum friction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <h4 className="font-bold mb-2">Fast Turnaround</h4>
                  <p className="text-sm text-muted-foreground">Most reports are delivered within 24 hours of payment. No waiting weeks for an analyst to build a model.</p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl">📹</span>
                  </div>
                  <h4 className="font-bold mb-2">Loom Walkthroughs</h4>
                  <p className="text-sm text-muted-foreground">We explain your numbers via Loom video. Watch it when it fits your schedule, share it with your co-founders.</p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <h4 className="font-bold mb-2">Total Privacy</h4>
                  <p className="text-sm text-muted-foreground">Your financial data is yours. We offer standard NDAs for all paid tiers before you even share your numbers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING FAQ */}
        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Pricing FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "What's the difference between the $49 and $297 plan?", a: "The $49 scan is purely automated based on our FSI engine. The $297 Audit includes a human review, a personalized Loom video explaining the nuances of your situation, and a 30-day step-by-step recovery plan." },
                { q: "Do you offer refunds?", a: "Because of the digital and custom nature of our audits, we don't offer standard refunds. However, if you feel the analysis was completely off-base, we will review it and make it right." },
                { q: "How do the Portfolio Packs work?", a: "Agencies and VCs buy a pack of 10 audits at a discount. You send us the financial data for 10 startups, and we return 10 white-labeled reports that you can present as your own value-add." }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card">
                  <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PricingPage;
