'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import { productsAPI } from '../../../lib/api';
import { useCartStore, useWishlistStore, useAuthStore } from '../../../lib/store';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  const addToCart = useCartStore(state => state.addItem);
  const { isInWishlist, addItem, removeItem } = useWishlistStore();

  useEffect(() => {
    if (params.id) {
      loadProduct();
      loadSimilarProducts();
    }
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(params.id);
      setProduct(response.data);
      if (response.data.variants && response.data.variants.length > 0) {
        setSelectedVariant(response.data.variants[0]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const similar = response.data
        .filter(p => p.id != params.id)
        .slice(0, 4);
      setSimilarProducts(similar);
    } catch (error) {
      console.error('Failed to load similar products:', error);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      toast.success(`${quantity} item(s) added to cart!`);
    }
  };

  const handleWishlistToggle = () => {
    const inWishlist = isInWishlist(product.id);
    if (inWishlist) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(product.id);
      toast.success('Added to wishlist');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return null;
  }

  const inWishlist = isInWishlist(product.id);
  const rating = 4.5; // Mock rating
  const reviews = 127; // Mock review count

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6 flex items-center space-x-2 text-gray-600">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary-600">Products</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name_english}</span>
          </nav>

          {/* Product Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="card overflow-hidden bg-white">
                <div className="relative aspect-square">
                  <img
                    src={`http://54.160.231.34${product.image_url}`}
                    alt={product.name_english}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {selectedVariant?.stock_quantity <= 10 && selectedVariant?.stock_quantity > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      Only {selectedVariant.stock_quantity} left!
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary-600 shadow-lg' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={`http://54.160.231.34${product.image_url}`}
                      alt={`${product.name_english} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name_english}
                </h1>
                <p className="text-2xl text-gray-700 mb-4">{product.name_hindi}</p>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : star - 0.5 <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">{rating} ({reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="bg-primary-50 p-6 rounded-xl mb-6">
                  <div className="flex items-baseline space-x-4">
                    <span className="text-4xl font-bold text-primary-600">
                      ₹{selectedVariant?.price}
                    </span>
                    <span className="text-lg text-gray-600">per {selectedVariant?.weight}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
                </div>

                {/* Variant Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Weight:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variants?.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary-600 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{variant.weight}</div>
                        <div className="text-lg font-bold text-primary-600">₹{variant.price}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {variant.stock_quantity > 0 ? `${variant.stock_quantity} in stock` : 'Out of stock'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantity:
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || 1, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                    className="flex-1 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`px-6 py-4 rounded-lg border-2 transition-all ${
                      inWishlist
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 hover:border-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <Truck className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                    <p className="text-xs font-medium text-gray-700">Free Delivery</p>
                    <p className="text-xs text-gray-500">On orders ₹500+</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto text-accent-600 mb-2" />
                    <p className="text-xs font-medium text-gray-700">100% Authentic</p>
                    <p className="text-xs text-gray-500">Quality assured</p>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                    <p className="text-xs text-gray-500">7-day return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="card mb-12">
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 font-semibold transition-colors relative ${
                    activeTab === 'description' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Description
                  {activeTab === 'description' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 font-semibold transition-colors relative ${
                    activeTab === 'reviews' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reviews ({reviews})
                  {activeTab === 'reviews' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 font-semibold transition-colors relative ${
                    activeTab === 'details' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Product Details
                  {activeTab === 'details' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    {product.description}
                  </p>
                  {product.ingredients && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Ingredients</h3>
                      <p className="text-gray-700">{product.ingredients}</p>
                    </div>
                  )}
                  {product.usage_instructions && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Usage Instructions</h3>
                      <p className="text-gray-700">{product.usage_instructions}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex items-center space-x-8 pb-6 border-b">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">{rating}</div>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{reviews} reviews</p>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 w-12">{star} star</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[
                      { name: 'Rajesh Kumar', rating: 5, date: '2 days ago', comment: 'Excellent quality! Tastes just like homemade achaar. The spices are perfectly balanced and the packaging is great.' },
                      { name: 'Priya Sharma', rating: 5, date: '1 week ago', comment: 'Best pickle I have bought online. Authentic taste and fresh ingredients. Will definitely order again!' },
                      { name: 'Amit Patel', rating: 4, date: '2 weeks ago', comment: 'Very good quality. Slightly more oil than I prefer, but taste is excellent. Fast delivery!' },
                    ].map((review, idx) => (
                      <div key={idx} className="border-b pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{review.name}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shelf Life</h4>
                    <p className="text-gray-700">{product.shelf_life || 'See packaging'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Storage Instructions</h4>
                    <p className="text-gray-700">{product.storage_instructions || 'Store in a cool, dry place'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                    <p className="text-gray-700 capitalize">{product.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Manufacturer</h4>
                    <p className="text-gray-700">Jain Sahab Special, Raghogarh, MP</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id} product={similarProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
