
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { toast } from 'sonner';
import FormField from '@/components/FormField.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    teamSize: '',
    aiSpend: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const teamSizeOptions = [
    { value: '1-5', label: '1-5 employees' },
    { value: '6-10', label: '6-10 employees' },
    { value: '11-25', label: '11-25 employees' },
    { value: '26-50', label: '26-50 employees' },
    { value: '51-100', label: '51-100 employees' },
    { value: '100+', label: '100+ employees' }
  ];

  const aiSpendOptions = [
    { value: '0-10K', label: '₹0 - ₹10K/month' },
    { value: '10K-50K', label: '₹10K - ₹50K/month' },
    { value: '50K-1L', label: '₹50K - ₹1L/month' },
    { value: '1L-5L', label: '₹1L - ₹5L/month' },
    { value: '5L+', label: '₹5L+/month' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pb.collection('leads').create(formData, { $autoCancel: false });
      
      toast.success('Your request has been submitted successfully');
      setSubmitted(true);
      setFormData({
        name: '',
        company: '',
        teamSize: '',
        aiSpend: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - FoundersROI</title>
        <meta name="description" content="Get your free AI ROI analysis. Contact us to learn how AI automation can transform your business." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="mb-4">Get Your Free ROI Analysis</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below and we will send you a personalized AI ROI report within 24 hours
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">✅</div>
                      <h3 className="text-2xl font-bold mb-2 text-primary">Request Submitted Successfully</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for your interest. We will send your personalized AI ROI analysis to {formData.email} within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="transition-all duration-200 active:scale-[0.98]"
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Maya Chen"
                        />
                        <FormField
                          label="Company Name"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          placeholder="Meridian Labs"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="Team Size"
                          name="teamSize"
                          type="select"
                          value={formData.teamSize}
                          onChange={handleChange}
                          required
                          placeholder="Select team size"
                          options={teamSizeOptions}
                        />
                        <FormField
                          label="Monthly AI Spend"
                          name="aiSpend"
                          type="select"
                          value={formData.aiSpend}
                          onChange={handleChange}
                          required
                          placeholder="Select AI spend range"
                          options={aiSpendOptions}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="maya@meridian.com"
                        />
                        <FormField
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <FormField
                        label="Tell us about your AI automation goals"
                        name="message"
                        type="textarea"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="What processes do you want to automate? What challenges are you facing?"
                        rows={5}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
                      >
                        {loading ? 'Submitting...' : 'Get My Free ROI Analysis'}
                      </Button>

                      <p className="text-sm text-muted-foreground text-center">
                        We respect your privacy. Your data will never be shared with third parties.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
