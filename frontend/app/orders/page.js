'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store';
import { ordersAPI } from '../../lib/api';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="card p-12 text-center">
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
              <a href="/products" className="btn-primary inline-block">
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="card p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          ₹{parseFloat(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {item.product?.name_english}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.variant?.weight} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Shipping Address:</p>
                      <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    </div>
                  )}

                  {/* Tracking Number */}
                  {order.tracking_number && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Tracking Number:</p>
                      <p className="text-sm text-gray-600 font-mono">{order.tracking_number}</p>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Payment: <span className="font-semibold capitalize">{order.payment_method}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.payment_status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
