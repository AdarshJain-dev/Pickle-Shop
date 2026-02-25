'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />

      <div className="bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-500 to-primary-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">About Jain Sahab Special</h1>
            <p className="text-xl opacity-90">हमारी कहानी - Our Story</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="card p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Heritage</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Jain Sahab Special was founded with a simple mission: to bring authentic, traditional Indian pickles
                  to every household. Our recipes have been passed down through generations, preserving the rich
                  culinary heritage of India.
                </p>
                <p>
                  We believe in using only the finest, hand-picked ingredients and traditional methods to create
                  pickles that taste just like homemade. Every jar is crafted with love and care, ensuring the
                  perfect balance of spices and flavors.
                </p>
                <p>
                  Our commitment to quality and authenticity has made us a trusted name in Indian households.
                  We take pride in maintaining the traditional taste while ensuring modern hygiene standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
                <p className="text-gray-600">
                  Only the finest ingredients and traditional methods
                </p>
              </div>

              <div className="text-center">
                <div className="bg-accent-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-10 h-10 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Natural</h3>
                <p className="text-gray-600">
                  No artificial preservatives or colors
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Made with Love</h3>
                <p className="text-gray-600">
                  Traditional recipes with a personal touch
                </p>
              </div>

              <div className="text-center">
                <div className="bg-accent-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
