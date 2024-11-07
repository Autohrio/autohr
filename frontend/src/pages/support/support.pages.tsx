import React from 'react';
import Header from '../home/components/header';
import Footer from '../home/components/footer';
import { FileText, Book, HelpCircle } from 'lucide-react';

const Support: React.FC = () => {
  const supportCategories = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentation",
      description: "Detailed guides and API references",
      link: "/docs"
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Tutorials",
      description: "Step-by-step learning resources",
      link: "/tutorials"
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "FAQs",
      description: "Common questions answered",
      link: "/faqs"
    }
  ];

  const commonQuestions = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your email."
    },
    {
      question: "How do I integrate with existing systems?",
      answer: "AutoHr provides various API endpoints and integration guides. Check our documentation for detailed instructions."
    },
    {
      question: "What are the system requirements?",
      answer: "AutoHr is a cloud-based solution that works on any modern web browser. No special hardware or software installation is required."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-900 to-blue-600 text-white py-[10rem]">
          <div className="container mx-auto px-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2">
                <h1 className="text-5xl font-bold mb-4">How can we <span className="text-[#FF8D60]">help?</span></h1>
                <p className="text-xl mb-6">Find the answers you need in our support resources.</p>
                <div className="relative">
                  <input 
                    type="search" 
                    placeholder="Search for help..."
                    className="bg-blue-800 w-full px-6 py-3 rounded-full text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-indigo-900 mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <a href={category.link} className="text-indigo-900 font-bold">Learn more →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-16">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {commonQuestions.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-16 text-center">
            <div className="bg-[#e0def4] rounded-2xl p-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-gray-600 mb-6">Our support team is just a message away</p>
              <button className="bg-indigo-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-800">
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;