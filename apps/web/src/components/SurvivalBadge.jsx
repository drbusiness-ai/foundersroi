import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Download, Share2 } from 'lucide-react';

const SurvivalBadge = ({ companyName = 'My Startup', score, band, color, emoji, ohShitMoment }) => {
  const badgeRef = useRef(null);

  const generatePNG = useCallback(async () => {
    if (!badgeRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: '#0f0f17',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `survival-score-${score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Badge generation failed:', err);
    }
  }, [score]);

  const shareOnLinkedIn = () => {
    const text = `🎯 My startup just got a ${score}/100 Survival Score from @FoundersROI.\n\n${emoji} ${band}\n\nCurious about yours? Free scan → foundersroi.com`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://foundersroi.com')}&summary=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    const text = `🎯 My startup just scored ${score}/100 on the Survival Score by @FoundersROI\n\n${emoji} ${band}\n\nGet yours free → foundersroi.com`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Badge Card — This is what gets captured as PNG */}
      <div
        ref={badgeRef}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f17, #1a1a2e)' }}
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-primary tracking-wider uppercase">
              FoundersROI
            </span>
            <span className="text-xs text-muted-foreground">
              foundersroi.com
            </span>
          </div>

          {/* Company Name */}
          <p className="text-lg font-semibold text-foreground mb-6">
            {companyName}
          </p>

          {/* Score */}
          <div className="text-center mb-6">
            <div className="inline-flex items-baseline gap-2">
              <span
                className="text-6xl sm:text-7xl font-bold"
                style={{ color }}
              >
                {score}
              </span>
              <span className="text-2xl text-muted-foreground font-medium">
                / 100
              </span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Survival Score
            </p>
          </div>

          {/* Band */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            <span className="text-lg">{emoji}</span>
            <span className="font-bold text-sm uppercase tracking-wide" style={{ color }}>
              {band}
            </span>
          </div>

          {/* One-liner */}
          <p className="text-sm text-muted-foreground italic leading-relaxed mt-4">
            "{ohShitMoment ? ohShitMoment.substring(0, 80) + (ohShitMoment.length > 80 ? '...' : '') : 'Analyze your startup fundamentals.'}"
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-6 sm:px-8 py-3 text-center"
          style={{ backgroundColor: `${color}08`, borderTop: `1px solid ${color}15` }}
        >
          <span className="text-xs text-muted-foreground">
            Get your free Survival Score → foundersroi.com
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <Button
          onClick={generatePNG}
          variant="outline"
          className="flex-1 gap-2 py-5 border-border hover:border-primary/50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
        <Button
          onClick={shareOnLinkedIn}
          variant="outline"
          className="flex-1 gap-2 py-5 border-border hover:border-blue-500/50 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button
          onClick={shareOnTwitter}
          variant="outline"
          className="flex-1 gap-2 py-5 border-border hover:border-sky-400/50 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Twitter / X
        </Button>
      </div>
    </div>
  );
};

export default SurvivalBadge;
