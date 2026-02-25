'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, Menu, Search, LogOut } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore } from '../lib/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore(state => state.items);
  const wishlistItems = useWishlistStore(state => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          🎉 Free Delivery on Orders Above ₹500 | Premium Quality Guaranteed 🎉
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
              <img
                src="/logo.png"
                alt="Jain Sahab Special Logo"
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden bg-gradient-to-br from-primary-500 to-primary-600 text-white w-14 h-14 rounded-full items-center justify-center font-bold text-2xl shadow-lg">
                JS
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                Jain Sahab Special
              </h1>
              <p className="text-xs text-gray-600 font-medium">जैन साहब स्पेशल - स्वाद का खजाना</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.is_admin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
                Contact
              </Link>
              {user && (
                <>
                  <Link href="/orders" className="text-gray-700 hover:text-primary-600 font-medium">
                    My Orders
                  </Link>
                  {user.is_admin && (
                    <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
