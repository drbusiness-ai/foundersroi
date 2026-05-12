import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

const ConversationalStep = ({ step, totalSteps, direction = 1, children }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center gap-3 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-secondary">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: i < step ? '100%' : i === step ? '50%' : '0%',
                  backgroundColor: i <= step
                    ? 'hsl(262, 83%, 58%)'
                    : 'hsl(240, 6%, 20%)',
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
        <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
          {step + 1} / {totalSteps}
        </span>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.25 },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ConversationalStep;
