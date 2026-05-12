import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { calculateFSI, validateInputs } from '@/lib/fsiEngine.js';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ConversationalStep from '@/components/ConversationalStep.jsx';
import MetricInput from '@/components/MetricInput.jsx';
import TextInput from '@/components/TextInput.jsx';
import ScoreDisplay from '@/components/ScoreDisplay.jsx';
import EmailGateModal from '@/components/EmailGateModal.jsx';
import SurvivalBadge from '@/components/SurvivalBadge.jsx';
import BlurredReport from '@/components/BlurredReport.jsx';
import { Button } from '@/components/ui/button.jsx';

// Business model options for the dropdown
const BUSINESS_MODELS = [
  { value: '', label: 'Select business model…' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Marketplace', label: 'Marketplace' },
  { value: 'Services', label: 'Services / Agency' },
  { value: 'Other', label: 'Other' },
];

// --- Step 0: Stage (module scope — stable reference, no input focus loss) ---
const STAGES = [
  { id: 'pre-revenue', label: 'Pre-Revenue / Idea', emoji: '🌱' },
  { id: 'bootstrapped', label: 'Bootstrapped', emoji: '💪' },
  { id: 'seed', label: 'Seed / Pre-Seed', emoji: '🚀' },
  { id: 'series-a', label: 'Series A', emoji: '📈' },
  { id: 'series-b', label: 'Series B+', emoji: '🏢' },
];

const StageStep = ({ stage, onSelectStage, onContinue }) => (
  <div className="space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold mb-8">What stage is your startup?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {STAGES.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelectStage(s.id)}
          className={`p-6 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
            stage === s.id
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20 scale-[1.02]'
              : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
          }`}
        >
          <span className="text-3xl">{s.emoji}</span>
          <span className="font-semibold text-lg">{s.label}</span>
        </button>
      ))}
    </div>

    <div className="flex gap-4 pt-6 mt-6 border-t border-border">
      <div className="flex-1" />
      <Button
        onClick={onContinue}
        disabled={!stage}
        className="flex-1 sm:flex-none py-6 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Continue
      </Button>
    </div>
  </div>
);

// --- Step 1: Worry (module scope — stable reference, no input focus loss) ---
const WORRIES = [
  { id: 'runway', label: 'Running out of money before we raise/profit', emoji: '💸' },
  { id: 'cac', label: "Can't acquire customers cheaply enough", emoji: '🎣' },
  { id: 'churn', label: 'Customers keep leaving (high churn)', emoji: '🪣' },
  { id: 'margins', label: 'Margins are too thin to scale', emoji: '📉' },
  { id: 'growth', label: 'Growth has stalled completely', emoji: '🐢' },
];

const WorryStep = ({ selected, onToggle, onContinue, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold mb-2">What keeps you up at night?</h2>
    <p className="text-muted-foreground mb-8">Select all that apply</p>

    <div className="grid grid-cols-1 gap-3">
      {WORRIES.map((w) => (
        <button
          key={w.id}
          onClick={() => onToggle(w.id)}
          className={`p-5 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
            selected.includes(w.id)
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
      <Button variant="outline" onClick={onBack} className="py-6 px-8">Back</Button>
      <Button
        onClick={onContinue}
        disabled={selected.length === 0}
        className="flex-1 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Continue
      </Button>
    </div>
  </div>
);

// --- Step 2: Metrics (module scope — stable reference, no input focus loss) ---
const MetricsStep = ({ formData, setFormData, validationErrors, isCalculating, onCalculate, onBack }) => {
  const getErrorFor = (label) => {
    return validationErrors.find(e => e.toLowerCase().includes(label.toLowerCase())) || '';
  };

  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <span className="text-3xl">🧮</span>
        </motion.div>
        <h3 className="text-xl font-semibold text-foreground">Calculating your Survival Score…</h3>
        <p className="text-muted-foreground text-sm">Analyzing your metrics against industry benchmarks</p>
        <div className="w-64 h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '40%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">The Hard Numbers</h2>
        <p className="text-muted-foreground">Don't guess. Use your real numbers for an accurate score.</p>
      </div>

      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive-foreground space-y-1"
        >
          {validationErrors.map((err, i) => (
            <p key={i} className="flex items-start gap-2">
              <span className="text-destructive shrink-0 mt-0.5">⚠</span>
              {err}
            </p>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <TextInput
          id="companyName"
          label="Company Name (Optional)"
          value={formData.companyName}
          onChange={(val) => setFormData(prev => ({ ...prev, companyName: val }))}
          placeholder="Acme Corp"
        />
        <div className="space-y-2">
          <label htmlFor="businessModel" className="text-sm font-medium text-foreground/90 cursor-pointer">
            Business Model
          </label>
          <div className="relative">
            <select
              id="businessModel"
              value={formData.businessModel}
              onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-lg border border-border bg-secondary/30 text-foreground text-base font-medium outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
            >
              {BUSINESS_MODELS.map((bm) => (
                <option key={bm.value} value={bm.value} className="bg-card text-foreground">
                  {bm.label}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>

        <MetricInput
          id="monthlyRevenue"
          label="Monthly Revenue (MRR/Gross)"
          prefix="$"
          value={formData.monthlyRevenue}
          onChange={(val) => setFormData(prev => ({ ...prev, monthlyRevenue: val }))}
          tooltip="Total revenue generated per month"
          error={getErrorFor('Monthly Revenue')}
        />
        <MetricInput
          id="monthlyBurn"
          label="Monthly Burn (Total Expenses)"
          prefix="$"
          value={formData.monthlyBurn}
          onChange={(val) => setFormData(prev => ({ ...prev, monthlyBurn: val }))}
          tooltip="Total cash going out every month (payroll, servers, ads, etc.)"
          error={getErrorFor('Monthly Burn')}
        />

        <MetricInput
          id="cashInBank"
          label="Cash in Bank"
          prefix="$"
          value={formData.cashInBank}
          onChange={(val) => setFormData(prev => ({ ...prev, cashInBank: val }))}
          tooltip="Total liquid cash available right now"
          error={getErrorFor('Cash in Bank')}
        />
        <MetricInput
          id="teamSize"
          label="Team Size"
          value={formData.teamSize}
          onChange={(val) => setFormData(prev => ({ ...prev, teamSize: val }))}
          placeholder="e.g. 12"
          min={0}
          error={formData.teamSize < 0 ? 'Team size cannot be negative' : ''}
        />

        <MetricInput
          id="cac"
          label="Customer Acquisition Cost (CAC)"
          prefix="$"
          value={formData.cac}
          onChange={(val) => setFormData(prev => ({ ...prev, cac: val }))}
          tooltip="Total sales & marketing spend / new customers acquired"
          error={getErrorFor('CAC')}
        />
        <MetricInput
          id="ltv"
          label="Lifetime Value (LTV)"
          prefix="$"
          value={formData.ltv}
          onChange={(val) => setFormData(prev => ({ ...prev, ltv: val }))}
          tooltip="Average revenue a customer generates before churning"
          error={getErrorFor('LTV')}
        />

        <MetricInput
          id="monthlyChurn"
          label="Monthly Revenue Churn"
          suffix="%"
          value={formData.monthlyChurn}
          onChange={(val) => setFormData(prev => ({ ...prev, monthlyChurn: val }))}
          tooltip="Percentage of recurring revenue lost this month"
          error={getErrorFor('Churn')}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-border">
        <Button variant="outline" onClick={onBack} className="py-6 px-8 sm:w-auto w-full">Back</Button>
        <Button
          onClick={onCalculate}
          disabled={isCalculating}
          className="flex-1 py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 disabled:opacity-50"
        >
          {isCalculating ? 'Calculating…' : 'Generate My Survival Score'}
        </Button>
      </div>
    </div>
  );
};

// --- Result View (module scope — stable reference, memoized to prevent re-renders) ---
const ResultView = React.memo(({ result, companyName, hasUnlocked, onUnlockClick, onScoreAnimationComplete }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto space-y-16 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <ScoreDisplay
            score={result.score}
            band={result.band}
            color={result.color}
            emoji={result.emoji}
            description={result.description}
            onComplete={onScoreAnimationComplete}
          />
        </div>
        <div className="flex justify-center lg:justify-end">
          <SurvivalBadge
            companyName={companyName || 'My Startup'}
            score={result.score}
            band={result.band}
            color={result.color}
            emoji={result.emoji}
            ohShitMoment={result.ohShitMoment}
          />
        </div>
      </div>

      <div className="h-px w-full bg-border" />

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.metricBreakdown.map((m, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl border border-border bg-card flex flex-col justify-between transition-all duration-500 ${
                !hasUnlocked ? 'report-blur select-none pointer-events-none' : ''
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
        </div>

        <AnimatePresence>
          {!hasUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center pt-4"
            >
              <Button
                onClick={onUnlockClick}
                size="lg"
                className="bg-primary text-primary-foreground text-lg py-6 px-8 shadow-xl"
              >
                Enter Email to Unlock Full Breakdown
              </Button>
              <p className="text-xs text-muted-foreground/50 mt-3">
                Your score is visible. Full breakdown is 1 click away.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasUnlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="pt-12 mt-12 border-t border-border overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-center mb-8">AI Narrative Analysis</h3>
            <BlurredReport />
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground italic">
                Your full AI-powered narrative report will appear here. [Phase 2]
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const SurvivalScorePage = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

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

  const nextStep = React.useCallback(() => {
    if (step === 0 && !formData.stage) return;
    if (step === 1 && formData.worry.length === 0) return;

    setDirection(1);
    setStep(s => s + 1);
    setValidationErrors([]);
  }, [step, formData.stage, formData.worry]);

  const prevStep = React.useCallback(() => {
    setDirection(-1);
    setStep(s => s - 1);
    setValidationErrors([]);
  }, []);

  const handleCalculate = React.useCallback(() => {
    const { valid, errors, sanitized } = validateInputs(formData);

    if (errors.length > 0) {
      setValidationErrors(errors);
      const hardErrors = errors.filter(e =>
        e.includes('cannot be negative') ||
        e.includes('valid number') ||
        e.includes('exceeds the maximum')
      );
      if (hardErrors.length > 0) {
        toast.error(hardErrors[0], { description: 'Please fix the highlighted fields before continuing.' });
      }
      if (!valid) return;
    }

    setIsCalculating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const fsiResult = calculateFSI(sanitized);
      setResult(fsiResult);
      setDirection(1);
      setIsCalculating(false);
      setStep(3);
    }, 800);
  }, [formData]);

  const handleEmailSubmit = React.useCallback(async (email) => {
    setIsSubmitting(true);
    try {
      await pb.collection('leads').create({
        email: email,
        fsi_score: result.score,
        survival_band: result.band,
        startup_stage: formData.stage,
      });
      setShowGate(false);
      setHasUnlocked(true);
      toast.success('Full analysis unlocked!', {
        description: 'Scroll down to see your complete metric breakdown.',
      });
    } catch (err) {
      const isOffline = !navigator.onLine;
      setShowGate(false);
      setHasUnlocked(true);
      if (isOffline) {
        toast.warning('You appear to be offline.', {
          description: 'Your analysis is unlocked, but we couldn\'t save your email. We\'ll try again when you\'re back online.',
        });
      } else {
        toast.error('Couldn\'t save your email.', {
          description: 'But your full analysis is unlocked below — no worries.',
        });
      }
      console.error('Failed to save lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [result, formData.stage]);

  const handleSelectStage = React.useCallback((stageId) => {
    setFormData(prev => ({ ...prev, stage: stageId }));
  }, []);

  const handleToggleWorry = React.useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      worry: prev.worry.includes(id)
        ? prev.worry.filter(w => w !== id)
        : [...prev.worry, id]
    }));
  }, []);

  const handleUnlockClick = React.useCallback(() => {
    setShowGate(true);
  }, []);

  // Stable callback for when the score counter animation finishes.
  // Only fires if the user hasn't unlocked yet, and the modal isn't already showing.
  const handleScoreAnimationComplete = React.useCallback(() => {
    if (!hasUnlocked && !showGate) {
      setTimeout(() => setShowGate(true), 1500);
    }
  }, [hasUnlocked, showGate]);

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
                {step === 0 && (
                  <StageStep
                    stage={formData.stage}
                    onSelectStage={handleSelectStage}
                    onContinue={nextStep}
                  />
                )}
                {step === 1 && (
                  <WorryStep
                    selected={formData.worry}
                    onToggle={handleToggleWorry}
                    onContinue={nextStep}
                    onBack={prevStep}
                  />
                )}
                {step === 2 && (
                  <MetricsStep
                    formData={formData}
                    setFormData={setFormData}
                    validationErrors={validationErrors}
                    isCalculating={isCalculating}
                    onCalculate={handleCalculate}
                    onBack={prevStep}
                  />
                )}
              </ConversationalStep>
            ) : (
              <ResultView
                result={result}
                companyName={formData.companyName}
                hasUnlocked={hasUnlocked}
                onUnlockClick={handleUnlockClick}
                onScoreAnimationComplete={handleScoreAnimationComplete}
              />
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
