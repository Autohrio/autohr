import React from 'react';
import { DASHIMG, LIFEGUARDTOWER } from '../../assets';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  }

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
      answer: "Yes, AutoHr is designed to scale with your business needs, making it suitable for small startups to large enterprises."
    },
    {
      question: "Can AutoHr integrate with other systems?",
      answer: "AutoHr offers seamless integration with various popular business tools and systems, enhancing overall operational efficiency."
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-indigo-900 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold">Auto<span className='text-[#FF8D60]'>Hr.</span></div>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="hover:text-indigo-300">Coverage</a>
            <a href="/" className="hover:text-indigo-300">Resources</a>
            <a href="/" className="hover:text-indigo-300">Blog</a>
            <a href="/" className="hover:text-indigo-300">About</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="btn btn-primary" onClick={handleDashboardNavigation}>Dashboard</button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-b from-indigo-900 to-blue-600 text-white py-[10rem]">
          <div className="container mx-auto px-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2">
                <h1 className="text-5xl font-bold mb-4">Re<span className='text-[#FF8D60]'>define</span> Human Resource Management.</h1>
                <p className="text-xl mb-6">Sick of the HR headache? Let's simplify your life.</p>
                <button className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold">Book a quick demo.</button>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <img src={LIFEGUARDTOWER} className='relative mb-[-15rem]' alt="Beach lifeguard tower" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 mt-20 container mx-auto px-64">
          <div className="flex items-center mb-16">
            <div className="bg-red-400 rounded-full w-[15rem] h-[10rem] flex items-center justify-center mr-4">
              <span className="text-white text-xl">soAffordable</span>
            </div>
            <h2 className="text-4xl font-black">
              We're reinventing human resource so you can <span className="text-red-400">save up to 25%!</span>
            </h2>
          </div>

          <h3 className="text-3xl px-8 font-bold mb-8 text-indigo-900">We put an end to this with our low-cost approach</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="p-6 rounded-lg mb-20">
                <h4 className="text-2xl font-bold mb-2 text-indigo-900">Medical Insurance</h4>
                <p className="text-gray-700 mb-4">Emergency medical coverage for Canadians traveling outside their province.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </div>
              <div className="bg-[#e0def4] h-[20rem] p-6 rounded-lg">
                <h4 className="text-5xl font-bold mb-2 text-indigo-900">Medical Insurance</h4>
                <p className="text-gray-700 mb-4">Emergency medical coverage for Canadians traveling outside their province.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </div>

            </div>
            <div>
              <div className="bg-[#facdc6] mb-20 h-[20rem] p-6 rounded-lg md:mt-16">
                <h4 className="text-5xl font-bold mb-2 text-indigo-900">Trip Insurance</h4>
                <p className="text-gray-700 mb-4">Trip cancellation and interruption insurance plan designed to protect against risks and financial losses.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </div>
              <div>
                <div className="bg-[#dbe6dd] p-6 rounded-lg h-[20rem]">
                  <div className="bg-green-400 text-white text-xs px-2 py-1 rounded mb-2 inline-block">TRAVEL INSURANCE FOR VISITORS TO CANADA</div>
                  <h3 className="text-5xl font-bold mb-2 text-indigo-900">Visitors Insurance</h3>
                  <p className="text-gray-700 mb-4">Travel insurance for visitors to Canada.</p>
                  <a href="/" className="text-indigo-900 font-bold">LEARN MORE →</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className='px-4 py-20 md:px-40'>
        <div className="flex items-center my-16">
          <h2 className="text-3xl md:text-4xl font-black text-center md:text-left">
            We're reinventing human resource <br className="hidden md:inline" /> so you can  <span className="text-red-400">save up to 25%!</span>
          </h2>
        </div>
        <div className="mockup-browser bg-gray-200 my-8 border shadow-2xl overflow-hidden">
          <div className="mockup-browser-toolbar"></div>
          <div className="bg-gray-200 flex justify-center py-4">
            <img src={DASHIMG} alt="Dashboard" className="max-w-full h-auto" />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-56">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions (FAQs)</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="collapse collapse-plus bg-white">
                <input type="radio" name="my-accordion-3" />
                <div className="collapse-title text-xl font-medium">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AutoHr</h3>
              <p>Redefining Human Resource Management</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600">Home</a></li>
                <li><a href="/" className="text-gray-600">About Us</a></li>
                <li><a href="/" className="text-gray-600">Services</a></li>
                <li><a href="/" className="text-gray-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600">Blog</a></li>
                <li><a href="/" className="text-gray-600">FAQs</a></li>
                <li><a href="/" className="text-gray-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="/" className="text-2xl text-gray-600">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="/" className="text-2xl text-gray-600">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="/" className="text-2xl text-gray-600">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 AutoHr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;