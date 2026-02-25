'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../lib/store';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const addToCart = useCartStore(state => state.addItem);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (selectedVariant) {
      addToCart(product, selectedVariant, 1);
      toast.success('Added to cart!');
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(product.id);
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col hover-lift animate-fade-in">
        {/* Image */}
        <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={`http://54.160.231.34${product.image_url}`}
              alt={product.name_english}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-5xl">🥫</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{product.category === 'masala' ? 'Masala' : 'Premium Pickle'}</p>
              </div>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 z-10 border border-gray-200"
          >
            <Heart
              className={`w-5 h-5 transition-all ${inWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-red-500'}`}
            />
          </button>

          {/* Quick View Badge */}
          <div className="absolute bottom-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Quick View
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Limited Stock Badge */}
          {selectedVariant?.stock_quantity <= 20 && (
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2 animate-pulse">
              🔥 Only {selectedVariant.stock_quantity} Left!
            </div>
          )}

          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {product.name_english}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{product.name_hindi}</p>

          {/* Rating Stars */}
          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-2">(127)</span>
          </div>

          <p className="text-sm text-gray-700 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Variants */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(variant);
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedVariant?.id === variant.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {variant.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="border-t pt-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-primary-600">
                    ₹{selectedVariant?.price}
                  </p>
                  {selectedVariant?.price >= 100 && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{Math.round(selectedVariant.price * 1.2)}
                    </span>
                  )}
                </div>
                {selectedVariant?.stock_quantity > 0 ? (
                  <p className="text-xs text-green-600 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    In Stock
                  </p>
                ) : (
                  <p className="text-xs text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>

              {selectedVariant?.price >= 100 && (
                <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  SAVE 20%
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold">Add to Cart</span>
            </button>

            {/* Fast Delivery Badge */}
            <p className="text-center text-xs text-gray-500 mt-2">
              🚚 Free delivery on orders ₹500+
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
