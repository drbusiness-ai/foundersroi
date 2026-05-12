import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { X, Lock, Sparkles } from 'lucide-react';

const EmailGateModal = ({ isOpen, onClose, onSubmit, score, band, isSubmitting }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    await onSubmit(email);
  };

  // Reset email state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative glass-card-strong rounded-2xl p-6 sm:p-8 w-full max-w-md z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">
                Unlock Your Full Analysis
              </h3>
              <p className="text-muted-foreground text-sm">
                Your score is <span className="font-bold text-foreground">{score}/100</span> ({band}).
                <br />
                Enter your email to see the complete metric breakdown and recommendations.
              </p>
            </div>

            {/* What's behind the gate */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
                You'll unlock:
              </p>
              {[
                'Metric-by-metric breakdown with benchmarks',
                'Your "Oh Sh*t Moment" diagnosis',
                'Shareable Survival Score badge',
                'Industry comparison analysis',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="founder@startup.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="bg-background border-border text-foreground focus-visible:ring-primary text-base py-5"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-400 mt-1.5">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 text-base font-semibold transition-all duration-200 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Unlocking...
                  </span>
                ) : (
                  'Unlock Full Analysis →'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground/60">
                We never share your data. NDA available on request.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailGateModal;
