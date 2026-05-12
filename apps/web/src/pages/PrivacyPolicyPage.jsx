
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Privacy Policy - FoundersROI`}</title>
        <meta name="description" content="FoundersROI Privacy Policy. Learn how we handle and protect your data." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="section-padding">
          <div className="container-custom max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl">Privacy Policy</h1>
              <p className="text-muted-foreground mb-8 sm:mb-12">Effective Date: May 9, 2026</p>

              <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <p>
                    Welcome to FoundersROI. This Privacy Policy explains what information we collect, how we use it, 
                    and how we protect your data when you use our AI ROI calculator and related services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">What Data We Collect</h2>
                  <p>
                    We only collect data that you voluntarily provide to us. When you use our contact form or purchase a report, we may collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Company name</li>
                    <li>Team size and related estimates</li>
                    <li>Current AI spend</li>
                  </ul>
                  <p className="mt-4">
                    Calculator inputs used without submitting a form are processed locally or transiently and are not permanently stored tied to your identity unless you request a report.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">How We Use It</h2>
                  <p>
                    The information we collect is used strictly for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                    <li>Generating and delivering your personalized AI ROI reports</li>
                    <li>Communicating with you regarding your inquiries or reports via email</li>
                    <li>Improving our product algorithms and calculator accuracy</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
                  <p>
                    We respect your privacy. <strong>We do not sell, rent, or trade your personal data to third parties under any circumstances.</strong> We only share data with trusted service providers (like payment processors or email delivery services) necessary to operate our business.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
                  <p>
                    Your data is stored securely on encrypted servers. We implement industry-standard security measures to prevent unauthorized access, disclosure, or modification of your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">User Rights</h2>
                  <p>
                    You have the right to access, update, or request deletion of your personal data at any time. To exercise these rights, please contact us via email, and we will process your request promptly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
                  <p>
                    We use basic analytics cookies to understand how visitors interact with our website. These cookies do not track personal identifiable information across other sites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us at:
                  </p>
                  <p className="mt-2">
                    <a href="mailto:hello@foundersroi.com" className="text-primary hover:underline">
                      hello@foundersroi.com
                    </a>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
