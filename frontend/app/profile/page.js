'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store';
import { User, Mail, Phone, MapPin, Package, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="card p-8 mb-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.name || 'User'}
                  </h1>
                  <p className="text-gray-600">Jain Sahab Special Customer</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900 font-semibold">{user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email Address
                    </label>
                    <p className="text-gray-900 font-semibold">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Phone Number
                    </label>
                    <p className="text-gray-900 font-semibold">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900 font-semibold">
                      {user?.address || 'No address saved. Add one during checkout.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/orders" className="card p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">My Orders</h3>
                    <p className="text-sm text-gray-600">Track your orders</p>
                  </div>
                </div>
              </Link>

              <Link href="/wishlist" className="card p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">My Wishlist</h3>
                    <p className="text-sm text-gray-600">Saved products</p>
                  </div>
                </div>
              </Link>

              <Link href="/products" className="card p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                    <Package className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Shop Products</h3>
                    <p className="text-sm text-gray-600">Browse our catalog</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Account Actions */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button
                  onClick={() => {
                    useAuthStore.getState().logout();
                    router.push('/');
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
