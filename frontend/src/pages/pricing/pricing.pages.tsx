import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import Footer from '../home/components/footer';

const PricingPage: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: ['Basic HR management', 'Up to 5 employees', 'Email support'],
      cta: 'Get Started',
      ctaAction: () => navigate('/login'),
      tag: 'Free trial',
      highlight: false
    },
    {
      name: 'Pro',
      price: { monthly: 19, yearly: 190 },
      features: ['Advanced HR tools', '5-100 employees', 'Priority support', 'Custom branding'],
      cta: 'Choose Pro',
      ctaAction: () => navigate('/login'),
      tag: 'Most popular',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 'Custom', yearly: 'Custom' },
      features: ['Full suite of HR tools', 'Unlimited employees', '24/7 dedicated support', 'Advanced analytics'],
      cta: 'Contact Us',
      ctaAction: () => window.location.href = 'mailto:sales@autohr.com',
      tag: '',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-orange-200 py-4 px-4 sm:px-6 lg:px-8">
      <header className="">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold"
          onClick={() => navigate("/")}
          >Auto<span className='text-[#FF8D60]'>Hr.</span></div>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-orange-500">Coverage</a>
            <a href="/" className="text-orange-500">Resources</a>
            <a href="/" className="text-orange-500">Blog</a>
            <a href="/" className="text-orange-500">About</a>
            <a href="/pricing" className="text-orange-500">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              className="bg-orange-400 text-white btn-primary"
              onClick={() => navigate('/')}
            >
              Go back Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mt-10 mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full p-1 bg-orange-100">
            <button
              className={`px-4 py-2 rounded-full ${isMonthly ? 'bg-orange-500 text-white' : 'text-orange-500'}`}
              onClick={() => setIsMonthly(true)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full ${!isMonthly ? 'bg-orange-500 text-white' : 'text-orange-500'}`}
              onClick={() => setIsMonthly(false)}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-3xl p-8 ${plan.highlight ? 'ring-4 ring-orange-300' : ''}`}
            >
              {plan.tag && (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full mb-4">
                  {plan.tag}
                </span>
              )}
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-4xl font-bold mb-1">
                ${typeof plan.price[isMonthly ? 'monthly' : 'yearly'] === 'number'
                  ? plan.price[isMonthly ? 'monthly' : 'yearly']
                  : plan.price[isMonthly ? 'monthly' : 'yearly']}
                <span className="text-base font-normal text-gray-500">
                  /{isMonthly ? 'month' : 'year'}
                </span>
              </p>
              <ul className="mt-6 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.highlight ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50'}`}
                onClick={plan.ctaAction}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-40'>
        <Footer />
      </div>
    </div>
  );
};

export default PricingPage;