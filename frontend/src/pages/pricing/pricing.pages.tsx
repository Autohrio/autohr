import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Basic HR management for small teams',
      features: ['Basic HR management', 'Up to 5 employees', 'Email support'],
      cta: 'Get Started',
      ctaAction: () => navigate('/login'),
      tag: 'Free trial'
    },
    {
      name: 'Pro',
      price: { monthly: 29, yearly: 190 },
      description: 'Advanced features for growing businesses',
      features: ['Advanced HR tools', '5-100 employees', 'Priority support', 'Custom branding'],
      cta: 'Choose Pro',
      ctaAction: () => navigate('/login'),
      tag: 'Most Popular',
      popular: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'Custom solutions for large organizations',
      features: ['Full suite of HR tools', 'Unlimited employees', '24/7 dedicated support', 'Advanced analytics'],
      cta: 'Contact Us',
      ctaAction: () => window.location.href = 'mailto:sales@autohr.com'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Original Hero Section */}
      <section className="mt-[-6rem] bg-gradient-to-b from-indigo-900 to-blue-600 text-white py-[10rem]">
        <motion.div 
          className="container mx-auto px-4 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-5xl font-bold mb-4">Simple, transparent <span className="text-[#FF8D60]">pricing</span></h1>
          <p className="text-xl mb-8">Choose the plan that's right for your business</p>
          
          <motion.div 
            className="inline-flex rounded-full p-1 bg-white/10 backdrop-blur-lg"
            whileHover={{ scale: 1.05 }}
          >
            <button
              className={`px-6 py-3 rounded-full transition-all ${isMonthly ? 'bg-[#FF8D60] text-white' : 'text-white'}`}
              onClick={() => setIsMonthly(true)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-3 rounded-full transition-all ${!isMonthly ? 'bg-[#FF8D60] text-white' : 'text-white'}`}
              onClick={() => setIsMonthly(false)}
            >
              Yearly
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* New Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border ${
                  plan.popular ? 'border-blue-600 relative' : 'border-gray-200'
                } p-6`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {typeof plan.price[isMonthly ? 'monthly' : 'yearly'] === 'number' && '$'}
                    </span>
                    <span className="text-3xl font-bold">
                      {plan.price[isMonthly ? 'monthly' : 'yearly']}
                    </span>
                    {typeof plan.price[isMonthly ? 'monthly' : 'yearly'] === 'number' && (
                      <span className="text-gray-500">/ month</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>
                <button
                  onClick={plan.ctaAction}
                  className={`w-full py-2 px-4 rounded-lg ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  } mb-6`}
                >
                  {plan.cta}
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;