import React from 'react';
import { motion } from 'framer-motion';
import { DASHIMG, LIFEGUARDTOWER } from '../../assets';

const Home: React.FC = () => {
  const faqs = [
    {
      question: "What is AutoHr?",
      answer: "AutoHr is an innovative HR management system that simplifies and automates various HR processes, helping organizations save time and reduce costs."
    },
    {
      question: "How does AutoHr save companies money?",
      answer: "AutoHr streamlines HR operations, reducing manual work and potential errors. This efficiency can lead to savings of up to 25% on HR-related costs."
    },
    {
      question: "Is AutoHr suitable for small businesses?",
      answer: "Absolutely! AutoHr is flexible and can grow with your company, whether you're a tiny startup or a big player."
    },
    {
      question: "Can AutoHr integrate with other systems?",
      answer: "AutoHr will be offering seamless integration with various popular business tools and systems, enhancing overall operational efficiency."
    }
  ];

  // Animation variants remain the same
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="mt-[-6rem] bg-gradient-to-b from-indigo-900 to-blue-600 text-white py-[10rem]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div 
                className="md:w-1/2 text-center md:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Re<motion.span 
                    className='text-[#FF8D60]'
                    animate={{ 
                      scale: [1, 1.1, 1],
                      color: ['#FF8D60', '#FFB088', '#FF8D60'] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >define</motion.span> Human Resource Management.
                </h1>
                <p className="text-lg sm:text-xl mb-6">Sick of the HR headache? Let's simplify your life.</p>
                <motion.button 
                  className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book a quick demo.
                </motion.button>
              </motion.div>
              <motion.div 
                className="md:w-1/2 mt-8 md:mt-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img 
                  src={LIFEGUARDTOWER} 
                  className='relative mb-[-8rem] md:mb-[-15rem] w-full max-w-lg mx-auto' 
                  alt="Beach lifeguard tower" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section 
          className="py-12 mt-20 container mx-auto px-4 sm:px-6 lg:px-16 xl:px-32"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-6 mb-16"
            variants={fadeInUp}
          >
            <motion.div 
              className="bg-red-400 rounded-full p-2 w-full md:w-[15rem] h-[8rem] md:h-[10rem] flex items-center justify-center"
              whileHover={{ rotate: 5 }}
            >
              <span className="text-white text-xl">soAffordable</span>
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-black text-center md:text-left">
              Upgrade your team, slash your bills: AI-powered HR that's{' '}
              <motion.span 
                className="text-red-400"
                animate={{ color: ['#f87171', '#ef4444', '#f87171'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                totally worth it.
              </motion.span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={staggerChildren}
          >
            {/* Feature cards remain the same, just adding padding adjustments */}
            <motion.div variants={fadeInUp}>
              <motion.div 
                className="p-4 sm:p-6 rounded-lg mb-8 sm:mb-20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h4 className="text-xl sm:text-2xl font-bold mb-2 text-indigo-900">Strategic Analytics</h4>
                <p className="text-gray-700 mb-4">Harness the power of real-time analytics to make data-driven decisions.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </motion.div>
              
              <motion.div 
                className="bg-[#e0def4] p-4 sm:p-6 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h4 className="text-3xl sm:text-5xl font-bold mb-2 text-indigo-900">Automated Onboarding</h4>
                <p className="text-gray-700 mb-4">Reduce administrative workload by up to 70% while ensuring a smooth, personalized welcome experience for every new team member.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <motion.div 
                className="bg-[#facdc6] mb-8 sm:mb-20 h-auto sm:h-[20rem] p-4 sm:p-6 rounded-lg md:mt-16"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h4 className="text-3xl sm:text-5xl font-bold mb-2 text-indigo-900">Personalized Engagement</h4>
                <p className="text-gray-700 mb-4">Boost workplace satisfaction and productivity with tailored employee experiences.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </motion.div>

              <motion.div 
                className="bg-[#dbe6dd] p-4 sm:p-6 rounded-lg h-auto sm:h-[20rem]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded-xl mb-2 inline-block">
                  INTELLIGENT POLICY ENFORCEMENT
                </div>
                <h3 className="text-3xl sm:text-5xl font-bold mb-2 text-indigo-900">Compliance Management</h3>
                <p className="text-gray-700 mb-4">Stay ahead of regulatory changes with our advanced compliance tools.</p>
                <a href="/" className="text-indigo-900 font-bold">LEARN MORE →</a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Dashboard Section */}
        <motion.section 
          className='px-4 sm:px-6 lg:px-16 xl:px-40 py-20'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={scaleIn}
        >
          <div className="flex items-center my-8 sm:my-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-center w-full">
              Cultivate Talent, Cut Costs & Create{' '}
              <motion.span 
                className="text-red-400"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ['#f87171', '#ef4444', '#f87171']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Success!
              </motion.span>
            </h2>
          </div>
          <motion.div 
            className="mockup-browser bg-gray-200 my-8 border shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mockup-browser-toolbar"></div>
            <div className="bg-gray-200 flex justify-center py-4">
              <img src={DASHIMG} alt="Dashboard" className="max-w-full h-auto" />
            </div>
          </motion.div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="py-16 sm:py-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-32">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center"
              variants={fadeInUp}
            >
              Frequently Asked Questions (FAQs)
            </motion.h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="collapse collapse-plus bg-white"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-lg sm:text-xl font-medium">
                    {faq.question}
                  </div>
                  <div className="collapse-content">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16 sm:py-24 bg-gray-50"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get started today</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto px-4">
              We'll walk you through how you can get started and provide recommendations on how to scale your team and setup.
            </p>
            <motion.button 
              className="bg-black text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a demo
            </motion.button>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;