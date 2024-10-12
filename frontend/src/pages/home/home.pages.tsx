import React from 'react';
import { LIFEGUARDTOWER } from '../../assets';

const Home = () => {
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
            <button className="btn btn-primary">Book Demo</button>
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
    </div>
  );
};

export default Home;