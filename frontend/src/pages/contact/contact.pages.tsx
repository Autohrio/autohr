import React from 'react';
import { Mail, MapPin, Phone, Clock, MessageSquare } from 'lucide-react';

// Contact Page Component
export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen">

      <main>
        {/* Hero Section */}
        <section className="mt-[-6rem] bg-gradient-to-b from-indigo-900 to-blue-600 text-white py-[10rem]">
          <div className="container mx-auto px-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2">
                <h1 className="text-5xl font-bold mb-4">Get in <span className="text-[#FF8D60]">Touch</span></h1>
                <p className="text-xl mb-6">We'd love to hear from you. Let us know how we can help.</p>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <div className="grid grid-cols-1 gap-4">
                    <p className="flex items-center">
                      <Clock className="w-5 h-5 mr-3" />
                      Response time: Within 24 hours
                    </p>
                    <p className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Available in multiple languages
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#e0def4] rounded-2xl p-8 text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-indigo-900" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Drop us a line anytime</p>
                <a href="mailto:hello@autohr.com" className="text-indigo-900 font-bold">hello@autohr.com</a>
              </div>

              <div className="bg-[#facdc6] rounded-2xl p-8 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-indigo-900" />
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Come say hello at our office</p>
                <address className="text-indigo-900 not-italic">
                  123 Business Avenue<br />
                  San Francisco, CA 94107
                </address>
              </div>

              <div className="bg-[#dbe6dd] rounded-2xl p-8 text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-indigo-900" />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+1234567890" className="text-indigo-900 font-bold">+1 (234) 567-890</a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-16">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-8 text-center">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" className="w-full bg-transparent px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-transparent px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full bg-transparent px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-transparent px-4 py-2 border rounded-lg"></textarea>
                </div>
                <button className="w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-800">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;