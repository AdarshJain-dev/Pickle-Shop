'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../lib/api';
import { ShoppingBag, Truck, Award, Shield } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickles = products.filter(p => p.category === 'pickle');
  const masalas = products.filter(p => p.category === 'masala');

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-bounce-subtle"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-400 rounded-full blur-3xl animate-bounce-subtle" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300 rounded-full blur-2xl animate-bounce-subtle" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Decorative Pickle Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce-subtle opacity-20">🥭</div>
          <div className="absolute top-40 right-20 text-5xl animate-bounce-subtle opacity-20" style={{animationDelay: '0.3s'}}>🍋</div>
          <div className="absolute bottom-20 left-20 text-5xl animate-bounce-subtle opacity-20" style={{animationDelay: '0.7s'}}>🌶️</div>
          <div className="absolute bottom-40 right-10 text-6xl animate-bounce-subtle opacity-20" style={{animationDelay: '0.5s'}}>🥫</div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              स्वाद का खजाना 🥘
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
              Jain Sahab Special
            </h2>
            <p className="text-xl md:text-3xl mb-8 opacity-90 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Authentic Indian Pickles & Traditional Achaar Masala
            </p>
            <p className="text-lg md:text-xl mb-10 opacity-80 animate-slide-up" style={{animationDelay: '0.3s'}}>
              Made with premium ingredients and traditional recipes passed down through generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Link href="/products" className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-105 active:scale-95">
                🛒 Shop Now
              </Link>
              <Link href="/about" className="bg-transparent border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 hover:scale-105 active:scale-95">
                📖 Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Only the finest ingredients</p>
            </div>

            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Natural</h3>
              <p className="text-gray-600 text-sm">No artificial preservatives</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
              <p className="text-gray-600 text-sm">On orders above ₹500</p>
            </div>

            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">7-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pickles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Premium Pickles
            </h2>
            <p className="text-lg text-gray-600">
              हमारे पारंपरिक अचार - Traditional recipes with modern hygiene
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pickles.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-4 bg-gradient-to-r from-red-500 to-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 text-white">
            <span className="text-2xl animate-bounce">🎉</span>
            <p className="text-lg md:text-xl font-bold">
              LIMITED TIME OFFER: Buy 2 Get 10% OFF | Free Shipping on Orders Above ₹500!
            </p>
            <span className="text-2xl animate-bounce">🎁</span>
          </div>
        </div>
      </section>

      {/* Achaar Masala Section */}
      {masalas.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                🌶️ Premium Achaar Masala
              </h2>
              <p className="text-lg text-gray-600">
                अचार मसाला - Make authentic pickles at home with our secret spice blend
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {masalas.map((masala) => (
                <ProductCard key={masala.id} product={masala} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-5xl font-bold text-primary-600 mb-2">10K+</div>
              <p className="text-gray-700 font-medium">Happy Customers</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-5xl font-bold text-primary-600 mb-2">15+</div>
              <p className="text-gray-700 font-medium">Years Experience</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl font-bold text-primary-600 mb-2">100%</div>
              <p className="text-gray-700 font-medium">Natural Ingredients</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl font-bold text-primary-600 mb-2">⭐ 4.8</div>
              <p className="text-gray-700 font-medium">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl mr-3">
                  👨
                </div>
                <div>
                  <p className="font-bold">Rajesh Kumar</p>
                  <p className="text-sm text-gray-600">Delhi</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Best mango pickle I've ever tasted! Reminds me of my grandmother's homemade achaar. Authentic taste!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl mr-3">
                  👩
                </div>
                <div>
                  <p className="font-bold">Priya Sharma</p>
                  <p className="text-sm text-gray-600">Mumbai</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The achaar masala is fantastic! Now I can make perfect pickles at home. Highly recommended!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl mr-3">
                  👨
                </div>
                <div>
                  <p className="font-bold">Amit Patel</p>
                  <p className="text-sm text-gray-600">Ahmedabad</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Premium quality and perfect spice balance. Fast delivery and great packaging. Will order again!"
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
