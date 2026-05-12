import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SurvivalBadge from '@/components/SurvivalBadge.jsx';
import { BANDS } from '@/lib/fsiEngine.js';

const ScoreResultPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Read from URL params for simple sharing
    const score = parseInt(searchParams.get('score')) || 72;
    const company = searchParams.get('company') || 'A Startup';
    
    // Find band based on score
    const clampedScore = Math.max(0, Math.min(100, score));
    const bandData = BANDS.find(b => clampedScore >= b.min && clampedScore <= b.max) || BANDS[2];

    setData({
      score: clampedScore,
      companyName: company,
      band: bandData.label,
      color: bandData.color,
      emoji: bandData.emoji,
      ohShitMoment: "Analyze your startup fundamentals before it's too late."
    });
  }, [searchParams]);

  if (!data) return null;

  return (
    <>
      <Helmet>
        <title>{`${data.companyName}'s Survival Score: ${data.score}/100 | FoundersROI`}</title>
        <meta name="description" content={`See ${data.companyName}'s Startup Survival Score. Get your own free AI diagnostic in 60 seconds.`} />
        {/* OG Tags for Social Sharing */}
        <meta property="og:title" content={`${data.companyName} scored ${data.score}/100 on the Survival Index`} />
        <meta property="og:description" content="Is your startup going to survive? Get your free AI diagnostic in 60 seconds." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 section-padding relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 hero-grid pointer-events-none" />
          
          <div className="container-custom relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Startup Survival Score
              </h1>
              <p className="text-lg text-muted-foreground">
                Shared by {data.companyName}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-12">
              <div className="w-full max-w-md animate-float-up">
                <SurvivalBadge 
                  companyName={data.companyName}
                  score={data.score}
                  band={data.band}
                  color={data.color}
                  emoji={data.emoji}
                  ohShitMoment={data.ohShitMoment}
                />
              </div>

              <div className="glass-card-strong p-8 rounded-2xl text-center max-w-lg w-full">
                <h3 className="text-2xl font-bold mb-4">Curious about your startup?</h3>
                <p className="text-muted-foreground mb-6">
                  Get your personalized AI-powered Survival Score in 60 seconds. No credit card required.
                </p>
                <Link to="/score">
                  <Button className="w-full py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300">
                    Get My Free Score
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ScoreResultPage;
