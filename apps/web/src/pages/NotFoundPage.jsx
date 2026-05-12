
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Page Not Found - FoundersROI`}</title>
        <meta name="description" content="The page you are looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center section-padding">
          <div className="container-custom text-center max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-foreground">
                Oops! This page doesn't exist.
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-10">
                But your AI ROI might 😄
              </p>
              
              <Link to="/calculator">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98]">
                  Calculate My ROI Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFoundPage;
