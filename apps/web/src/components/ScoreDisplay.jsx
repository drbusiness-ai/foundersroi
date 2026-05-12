import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ScoreDisplay = ({ score, band, color, emoji, description, onComplete }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const animFrameRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const hasCalledComplete = useRef(false);

  // Keep onComplete ref current without re-triggering the effect
  onCompleteRef.current = onComplete;

  // Count-up animation — only restarts when score changes, not when onComplete ref changes
  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();
    const target = score;
    hasCalledComplete.current = false;
    setAnimationDone(false);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimationDone(true);
        // Only fire onComplete once per animation cycle
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [score]);

  const scoreAngle = (displayScore / 100) * 360;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6"
    >
      {/* Score Ring */}
      <div
        className="relative glow-score"
        style={{ '--score-glow': `${color}66` }}
      >
        <div
          className="score-ring"
          style={{
            '--score-angle': `${scoreAngle}deg`,
            '--score-color': color,
          }}
        >
          <div className="score-ring-inner">
            <motion.span
              className="text-5xl md:text-6xl font-bold"
              style={{ color }}
            >
              {displayScore}
            </motion.span>
            <span className="text-muted-foreground text-sm font-medium mt-1">
              / 100
            </span>
          </div>
        </div>

        {/* Animated glow pulse */}
        {animationDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.9, 1.2, 1.3] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${color}20, transparent 70%)` }}
          />
        )}
      </div>

      {/* Band Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: animationDone ? 1 : 0, y: animationDone ? 0 : 10 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">{emoji}</span>
          <span
            className="text-xl md:text-2xl font-bold uppercase tracking-wide"
            style={{ color }}
          >
            {band}
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ScoreDisplay;
