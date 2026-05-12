import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { calculateFSI } from '@/lib/fsiEngine.js';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ConversationalStep from '@/components/ConversationalStep.jsx';
import MetricInput from '@/components/MetricInput.jsx';
import ScoreDisplay from '@/components/ScoreDisplay.jsx';
import EmailGateModal from '@/components/EmailGateModal.jsx';
import SurvivalBadge from '@/components/SurvivalBadge.jsx';
import BlurredReport from '@/components/BlurredReport.jsx';
import { Button } from '@/components/ui/button.jsx';

const SurvivalScorePage = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  
  // FSI Result
  const [result, setResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    stage: '',
    worry: [],
    monthlyRevenue: 0,
    monthlyBurn: 0,
    cashInBank: 0,
    cac: 0,
    ltv: 0,
    monthlyChurn: 0,
    teamSize: 0,
    businessModel: '',
    companyName: '',
  });

  const nextStep = () => {
    if (step === 0 && !formData.stage) return;
    if (step === 1 && formData.worry.length === 0) return;
    
    setDirection(1);
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleCalculate = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Calculate Score
    const fsiResult = calculateFSI({
      monthlyRevenue: formData.monthlyRevenue,
      monthlyBurn: formData.monthlyBurn,
      cashInBank: formData.cashInBank,
      cac: formData.cac,
      ltv: formData.ltv,
      monthlyChurn: formData.monthlyChurn,
      teamSize: formData.teamSize,
      stage: formData.stage,
      businessModel: formData.businessModel,
    });
    
    setResult(fsiResult);
    setDirection(1);
    setStep(3); // Result view
  };

  const handleEmailSubmit = async (email) => {
    setIsSubmitting(true);
    try {
      await pb.collection('leads').create({
        email: email,
        fsi_score: result.score,
        survival_band: result.band,
        startup_stage: formData.stage,
        // other fields can be added if needed based on schema
      });
      setShowGate(false);
      setHasUnlocked(true);
    } catch (err) {
      console.error('Failed to save lead:', err);
      // Even if it fails (e.g., offline), we let them through for a good UX
      setShowGate(false);
      setHasUnlocked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step 1: Stage ---
  const StageStep = () => {
    const stages = [
      { id: 'pre-revenue', label: 'Pre-Revenue / Idea', emoji: '🌱' },
      { id: 'bootstrapped', label: 'Bootstrapped', emoji: '💪' },
      { id: 'seed', label: 'Seed / Pre-Seed', emoji: '🚀' },
      { id: 'series-a', label: 'Series A', emoji: '📈' },
      { id: 'series-b', label: 'Series B+', emoji: '🏢' },
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">What stage is your startup?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setFormData({ ...formData, stage: s.id });
                setTimeout(() => nextStep(), 300);
              }}
              className={`p-6 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
                formData.stage === s.id
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20 scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <span className="text-3xl">{s.emoji}</span>
              <span className="font-semibold text-lg">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- Step 2: Worry ---
  const WorryStep = () => {
    const worries = [
      { id: 'runway', label: 'Running out of money before we raise/profit', emoji: '💸' },
      { id: 'cac', label: "Can't acquire customers cheaply enough", emoji: '🎣' },
      { id: 'churn', label: 'Customers keep leaving (high churn)', emoji: '🪣' },
      { id: 'margins', label: 'Margins are too thin to scale', emoji: '📉' },
      { id: 'growth', label: 'Growth has stalled completely', emoji: '🐢' },
    ];

    const toggleWorry = (id) => {
      setFormData(prev => ({
        ...prev,
        worry: prev.worry.includes(id) 
          ? prev.worry.filter(w => w !== id)
          : [...prev.worry, id]
      }));
    };

    return (
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">What keeps you up at night?</h2>
        <p className="text-muted-foreground mb-8">Select all that apply</p>
        
        <div className="grid grid-cols-1 gap-3">
          {worries.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleWorry(w.id)}
              className={`p-5 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
                formData.worry.includes(w.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="text-2xl">{w.emoji}</span>
              <span className="font-medium">{w.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4 pt-6 mt-6 border-t border-border">
          <Button variant="outline" onClick={prevStep} className="py-6 px-8">Back</Button>
          <Button 
            onClick={nextStep} 
            disabled={formData.worry.length === 0}
            className="flex-1 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  // --- Step 3: Metrics ---
  const MetricsStep = () => {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">The Hard Numbers</h2>
          <p className="text-muted-foreground">Don't guess. Use your real numbers for an accurate score.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <MetricInput
            id="companyName"
            label="Company Name (Optional)"
            value={formData.companyName}
            onChange={(val) => setFormData({ ...formData, companyName: val })}
            placeholder="Acme Corp"
            isNumeric={false}
          />
          <MetricInput
            id="businessModel"
            label="Business Model"
            value={formData.businessModel}
            onChange={(val) => setFormData({ ...formData, businessModel: val })}
            placeholder="SaaS, E-commerce, etc."
            isNumeric={false}
          />
          
          <MetricInput
            id="monthlyRevenue"
            label="Monthly Revenue (MRR/Gross)"
            prefix="$"
            value={formData.monthlyRevenue}
            onChange={(val) => setFormData({ ...formData, monthlyRevenue: val })}
            tooltip="Total revenue generated per month"
          />
          <MetricInput
            id="monthlyBurn"
            label="Monthly Burn (Total Expenses)"
            prefix="$"
            value={formData.monthlyBurn}
            onChange={(val) => setFormData({ ...formData, monthlyBurn: val })}
            tooltip="Total cash going out every month (payroll, servers, ads, etc.)"
          />
          
          <MetricInput
            id="cashInBank"
            label="Cash in Bank"
            prefix="$"
            value={formData.cashInBank}
            onChange={(val) => setFormData({ ...formData, cashInBank: val })}
            tooltip="Total liquid cash available right now"
          />
          <MetricInput
            id="teamSize"
            label="Team Size"
            value={formData.teamSize}
            onChange={(val) => setFormData({ ...formData, teamSize: val })}
            placeholder="e.g. 12"
          />
          
          <MetricInput
            id="cac"
            label="Customer Acquisition Cost (CAC)"
            prefix="$"
            value={formData.cac}
            onChange={(val) => setFormData({ ...formData, cac: val })}
            tooltip="Total sales & marketing spend / new customers acquired"
          />
          <MetricInput
            id="ltv"
            label="Lifetime Value (LTV)"
            prefix="$"
            value={formData.ltv}
            onChange={(val) => setFormData({ ...formData, ltv: val })}
            tooltip="Average revenue a customer generates before churning"
          />
          
          <MetricInput
            id="monthlyChurn"
            label="Monthly Revenue Churn"
            suffix="%"
            value={formData.monthlyChurn}
            onChange={(val) => setFormData({ ...formData, monthlyChurn: val })}
            tooltip="Percentage of recurring revenue lost this month"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-border">
          <Button variant="outline" onClick={prevStep} className="py-6 px-8 sm:w-auto w-full">Back</Button>
          <Button 
            onClick={handleCalculate}
            className="flex-1 py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300"
          >
            Generate My Survival Score
          </Button>
        </div>
      </div>
    );
  };

  // --- Result View ---
  const ResultView = () => {
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto space-y-16 py-8"
      >
        {/* Top Section: Score & Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <ScoreDisplay 
              score={result.score}
              band={result.band}
              color={result.color}
              emoji={result.emoji}
              description={result.description}
              onComplete={() => {
                // Show gate shortly after score animation completes, if not already unlocked
                if (!hasUnlocked) {
                  setTimeout(() => setShowGate(true), 1500);
                }
              }}
            />
          </div>
          <div className="flex justify-center lg:justify-end">
            <SurvivalBadge 
              companyName={formData.companyName || 'My Startup'}
              score={result.score}
              band={result.band}
              color={result.color}
              emoji={result.emoji}
              ohShitMoment={result.ohShitMoment}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Breakdown Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold mb-4">The "Oh Sh*t" Moment</h3>
            <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 inline-block">
              <p className="text-lg font-medium text-destructive-foreground">
                "{result.ohShitMoment}"
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center mb-8">Metric Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {/* The Metrics */}
            {result.metricBreakdown.map((m, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-xl border border-border bg-card flex flex-col justify-between ${
                  !hasUnlocked ? 'report-blur' : ''
                }`}
              >
                <div>
                  <div className="text-sm text-muted-foreground font-medium mb-1">{m.label}</div>
                  <div className="text-3xl font-bold mb-4">
                    {m.value}{m.unit}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-bold">{m.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        m.status === 'good' ? 'bg-green-500' : 
                        m.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Healthy benchmark: {m.benchmark.good}{m.unit}
                  </p>
                </div>
              </div>
            ))}

            {/* Gate Overlay if locked */}
            {!hasUnlocked && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-background/40 backdrop-blur-sm rounded-xl">
                <Button 
                  onClick={() => setShowGate(true)}
                  size="lg" 
                  className="bg-primary text-primary-foreground text-lg py-6 px-8 shadow-xl"
                >
                  Enter Email to Unlock Full Breakdown
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Narrative / AI Section Placeholder */}
        {hasUnlocked && (
          <div className="pt-12 mt-12 border-t border-border">
            <h3 className="text-2xl font-bold text-center mb-8">AI Narrative Analysis</h3>
            <BlurredReport />
            <div className="text-center mt-6">
               <p className="text-sm text-muted-foreground italic">
                 Your full AI-powered narrative report will appear here. [Phase 2]
               </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Startup Survival Score | FoundersROI</title>
        <meta name="description" content="Get your AI-powered Startup Survival Score in 60 seconds. Know exactly what to fix before it's too late." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center section-padding">
          <div className="container-custom w-full">
            {step < 3 ? (
              <ConversationalStep step={step} totalSteps={3} direction={direction}>
                {step === 0 && <StageStep />}
                {step === 1 && <WorryStep />}
                {step === 2 && <MetricsStep />}
              </ConversationalStep>
            ) : (
              <ResultView />
            )}
          </div>
        </main>

        <Footer />
      </div>

      <EmailGateModal 
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        onSubmit={handleEmailSubmit}
        score={result?.score}
        band={result?.band}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default SurvivalScorePage;
