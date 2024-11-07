import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a section
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100); // Small delay to ensure the page is rendered
      }
    }
  }, [location]);
  // const stats = [
  //   {
  //     number: "95%",
  //     label: "Client Satisfaction",
  //     description: "Our clients consistently rate our HR solutions with high marks"
  //   },
  //   {
  //     number: "70%",
  //     label: "Time Saved",
  //     description: "Average reduction in HR administrative tasks"
  //   },
  //   {
  //     number: "10k+",
  //     label: "Active Users",
  //     description: "Growing community of satisfied HR professionals"
  //   }
  // ];

  const features = [
    {
      title: "Our Mission",
      description: "Revolutionizing HR management through innovative technology and human-centered design"
    },
    {
      title: "Our Vision",
      description: "To become the global standard for intelligent HR management systems"
    },
    {
      title: "Our Values",
      description: "Innovation, Integrity, Excellence, and Customer Success"
    }
  ];

  // const newsItems = [
  //   {
  //     publisher: "TechCrunch",
  //     title: "AutoHr lands $7M investment to build a full service HR platform",
  //     logo: "/techcrunch-logo.png"
  //   },
  //   {
  //     publisher: "Andreessen Horowitz",
  //     title: "Investing in AutoHr",
  //     logo: "/a16z-logo.png"
  //   },
  //   {
  //     publisher: "General Catalyst",
  //     title: "Our Investment in AutoHr - A Modern HR System for Modern Teams",
  //     logo: "/gc-logo.png"
  //   }
  // ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }
  };

  const staggerChildren = {
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section - Matching landing page style */}
        <section className="mt-[-6rem] bg-gradient-to-b from-indigo-900 to-blue-600 text-white py-[10rem]">
          <div className="container mx-auto px-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl font-bold mb-4">About <motion.span 
                  className="text-[#FF8D60]"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    color: ['#FF8D60', '#FFB088', '#FF8D60']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >AutoHr</motion.span></h1>
                <p className="text-xl mb-6">Transforming HR management with innovation and intelligence.</p>
                <motion.button 
                  className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >Join our team</motion.button>
              </motion.div>
              <motion.div 
                className="md:w-1/2 mt-8 md:mt-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Stats section commented out but preserved */}
                {/* <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-4xl font-bold text-[#FF8D60]">{stat.number}</div>
                        <div className="text-sm mt-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column */}
              <motion.div 
                className="space-y-8"
                variants={staggerChildren}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-white rounded-2xl p-8 shadow-lg"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                  <p className="text-gray-600">
                    Founded with a vision to revolutionize HR management, AutoHr has grown from a simple idea to a comprehensive HR solution trusted by companies worldwide. We believe in making HR simple, efficient, and human-centered.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-[#e0def4] rounded-2xl p-8"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
                  <ul className="space-y-4">
                    <motion.li 
                      className="flex items-start"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="bg-indigo-900 rounded-full p-2 mr-4">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold">Innovation First</h3>
                        <p className="text-gray-600">Cutting-edge AI and automation technology</p>
                      </div>
                    </motion.li>
                    <motion.li 
                      className="flex items-start"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="bg-indigo-900 rounded-full p-2 mr-4">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold">Customer Success</h3>
                        <p className="text-gray-600">Dedicated support and training</p>
                      </div>
                    </motion.li>
                  </ul>
                </motion.div>
              </motion.div>

              {/* Right Column */}
              <motion.div 
                className="space-y-8"
                variants={staggerChildren}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-[#facdc6] rounded-2xl p-6"
                      variants={fadeInScale}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="bg-[#dbe6dd] rounded-2xl p-8"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded-xl mb-2 inline-block">
                    OUR COMMITMENT
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Building the Future of HR</h2>
                  <p className="text-gray-600 mb-4">
                    We're committed to continuous innovation and improvement, ensuring our platform evolves with your needs.
                  </p>
                  <motion.button 
                    className="text-indigo-900 font-bold"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Learn about our roadmap →
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <motion.section 
          className="py-16 bg-white"
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 md:px-16">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-gray-50 rounded-2xl p-6 text-center"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.img 
                  className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"
                  src="https://avatars.githubusercontent.com/u/43869046?v=4"
                  alt=""
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <h3 className="font-bold">Siddhant Prateek</h3>
                <p className="text-gray-600">CEO & Co-founder</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Coverage Section */}
        <motion.section
          id="news-section" 
          className="py-16 bg-white"
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 md:px-16">
            <h2 className="text-4xl font-bold mb-8">News</h2>
            <p className="text-gray-600 mb-8">Recent mentions in publications</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* News items section commented out but preserved */}
              {/* {newsItems.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-sm text-gray-600 mb-2">{item.publisher}</div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              ))} */}
            </div>
          </div>
        </motion.section>

        {/* Get Started Section */}
        <motion.section 
          className="py-24 bg-gray-50"
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 md:px-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Get started today</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We'll walk you through how you can get started and provide recommendations on how to scale your team and setup.
            </p>
            <motion.button 
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
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

export default About;