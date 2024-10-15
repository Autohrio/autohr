import React from 'react';
import { DASHIMG, LIFEGUARDTOWER } from '../../assets';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/useAuth';
import Header from './components/header';
import Footer from './components/footer';

const Home: React.FC = () => {
  // const navigate = useNavigate();
  // const { user } = useAuth();


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

  return (
    <div className="min-h-screen">
      <Header />

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
            <div className="bg-red-400 rounded-full p-2 w-[15rem] h-[10rem] flex items-center justify-center mr-4">
              <span className="text-white text-xl">soAffordable</span>
            </div>
            <h2 className="text-4xl font-black">
            Upgrade your team, slash your bills: AI-powered HR that's <span className="text-red-400">totally worth it.</span>
            </h2>
          </div>

          <h3 className="text-2xl text-center px-8 font-bold mb-8 text-indigo-900">
            Tired of the same old HR routine? <br />
            Let's shake things up. With intelligent automation, 
            we're not just managing people.  we're boosting productivity, cutting costs, 
            and creating a thriving company culture.
          <br /> <span className='text-blue-600'>Ready to level up your HR game?</span></h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="p-6 rounded-lg mb-20">
                <h4 className="text-2xl font-bold mb-2 text-indigo-900">Strategic Analytics</h4>
                <p className="text-gray-700 mb-4">Harness the power of real-time analytics to make data-driven decisions.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </div>
              <div className="bg-[#e0def4] p-6 rounded-lg">
                <h4 className="text-5xl font-bold mb-2 text-indigo-900">Automated Onboarding</h4>
                <p className="text-gray-700 mb-4">Reduce administrative workload by up to 70% while ensuring a smooth, personalized welcome experience for every new team member.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </div>

            </div>
            <div>
              <div className="bg-[#facdc6] mb-20 h-[20rem] p-6 rounded-lg md:mt-16">
                <h4 className="text-5xl font-bold mb-2 text-indigo-900">Personalized Engagement</h4>
                <p className="text-gray-700 mb-4">Boost workplace satisfaction and productivity with tailored employee experiences.</p>
                <a href="/" className="text-indigo-900 font-bold">Learn More →</a>
              </div>
              <div>
                <div className="bg-[#dbe6dd] p-6 rounded-lg h-[20rem]">
                  <div className="bg-green-400 text-green-900  text-xs px-2 py-1 rounded-xl mb-2 inline-block">INTELLIGENT POLICY ENFORCEMENT</div>
                  <h3 className="text-5xl font-bold mb-2 text-indigo-900">Compliance Management</h3>
                  <p className="text-gray-700 mb-4">Stay ahead of regulatory changes with our advanced compliance tools.</p>
                  <a href="/" className="text-indigo-900 font-bold">LEARN MORE →</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className='px-4 py-20 md:px-40'>
        <div className="flex items-center my-16">
          <h2 className="text-3xl md:text-5xl font-black text-center md:text-left">
          Cultivate Talent, Cut Costs & Create <span className="text-red-400">Success!</span>
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

      <Footer />
    </div>
  );
};

export default Home;