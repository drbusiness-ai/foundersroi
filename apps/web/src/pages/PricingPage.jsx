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
              <h1 className="mb-4 text-4xl md:text-5xl font-bold">The Truth. No Calls Required.</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select your level of analysis. Delivered directly to your inbox. No sales calls, no pitches, just pure actionable truth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
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

              {/* Tier 3: Sprint */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex"
              >
                <Card className="w-full bg-card border-border flex flex-col hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground font-medium">Recovery Sprint</CardTitle>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold">$2,497</span>
                      <span className="text-muted-foreground text-sm ml-2">USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">5-Week guided async program</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {['5 Weeks of guided execution', 'Weekly AI Truth Report + Loom video', 'Unlimited async Q&A via email/Slack', 'Financial model reconstruction', 'Pitch deck financial narrative review', 'Everything in Full Audit'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-6 border-t border-border/50">
                    <a href="#stripe-l3" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="w-full py-6 text-base border-border hover:bg-secondary">
                        Start Sprint Program
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
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-4">
                NO CALLS. EVER.
              </p>
            </motion.div>

          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PricingPage;
