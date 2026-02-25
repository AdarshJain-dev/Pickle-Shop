'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { productsAPI } from '../../lib/api';
import { useWishlistStore } from '../../lib/store';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlistItems = useWishlistStore(state => state.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [wishlistItems]);

  const loadProducts = async () => {
    if (wishlistItems.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await productsAPI.getAll();
      const wishlistProducts = response.data.filter(p => wishlistItems.includes(p.id));
      setProducts(wishlistProducts);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading wishlist...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="card p-12">
                <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8">Save your favorite products here!</p>
                <Link href="/products" className="btn-primary inline-block">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{products.length} {products.length === 1 ? 'item' : 'items'} saved</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
