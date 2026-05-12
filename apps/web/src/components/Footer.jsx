import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/30 text-secondary-foreground border-t border-border mt-auto">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">
              Founders<span className="text-primary">ROI</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
              The AI Startup Truth Engine. We help founders diagnose financial leaks and extend runway before it's too late.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6 bg-secondary/50 inline-flex px-4 py-2 rounded-full border border-border">
              <Shield className="w-4 h-4 text-primary" />
              <span>100% Confidential. NDA Available.</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@foundersroi.com" className="hover:text-primary transition-colors duration-200">
                hello@foundersroi.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Product</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/score" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Survival Score
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Pricing (USD)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FoundersROI. All rights reserved.</p>
          <p>Built for founders, by founders.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
