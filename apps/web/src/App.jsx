import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner.jsx';

import ScrollToTop from '@/components/ScrollToTop.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';
import InstallPrompt from '@/components/InstallPrompt.jsx';

import HomePage from '@/pages/HomePage.jsx';
import SurvivalScorePage from '@/pages/SurvivalScorePage.jsx';
import ScoreResultPage from '@/pages/ScoreResultPage.jsx';
import PricingPage from '@/pages/PricingPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/score" element={<SurvivalScorePage />} />
        <Route path="/score/result" element={<ScoreResultPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <FloatingWhatsAppButton />
      <InstallPrompt />
      <Toaster />
    </Router>
  );
}

export default App;
