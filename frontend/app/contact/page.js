'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">हमसे संपर्क करें - We'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600">
                      151, Katra Mohalla<br />
                      Hanuman Road, Ward No. 2<br />
                      Raghogarh 473226<br />
                      Madhya Pradesh, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">
                      +91 94225 76107<br />
                      Contact: Sukmal Jain
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">
                      sukmaljainbussiness@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" className="input-field" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="input-field" placeholder="your@email.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" className="input-field" placeholder="+91 98765 43210" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    className="input-field"
                    rows={5}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
