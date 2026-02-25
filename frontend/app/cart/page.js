'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PaymentModal from '../../components/PaymentModal';
import { useCartStore, useAuthStore } from '../../lib/store';
import { ordersAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const total = getTotal();
  const deliveryCharge = total >= 500 ? 0 : 50;
  const finalTotal = total + deliveryCharge;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter shipping address');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          variantId: item.variant.id,
          quantity: item.quantity
        })),
        payment_method: 'pending',
        shipping_address: shippingAddress
      };

      const response = await ordersAPI.create(orderData);

      // Set order details and show payment modal
      setOrderDetails({
        orderId: response.data.orderId,
        totalAmount: finalTotal,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone
      });
      setShowPaymentModal(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push('/orders');
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl p-12 shadow-md">
                <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Add some delicious pickles to your cart!</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.variant.id} className="card p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {item.product.name_english}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.product.name_hindi}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Weight: <span className="font-semibold">{item.variant.weight}</span>
                      </p>
                      <p className="text-2xl font-bold text-primary-600">
                        ₹{item.variant.price}
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.variant.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charge</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {total < 500 && (
                    <p className="text-sm text-accent-600">
                      Add ₹{(500 - total).toFixed(2)} more for free delivery!
                    </p>
                  )}
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address *
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Enter delivery address"
                    required
                  ></textarea>
                </div>


                <button
                  onClick={handleCheckout}
                  disabled={loading || !shippingAddress.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Payment Modal */}
      {showPaymentModal && orderDetails && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderDetails={orderDetails}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
