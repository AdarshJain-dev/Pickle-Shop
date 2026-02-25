'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentModal({ isOpen, onClose, orderDetails, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleOnlinePayment = async () => {
    setProcessing(true);
    try {
      // Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderDetails.totalAmount,
          orderId: orderDetails.orderId
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to create payment order');
      }

      // DEMO MODE: If mockMode is enabled, simulate payment
      if (data.mockMode) {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify payment (demo mode)
        const verifyResponse = await fetch('/api/payments/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: data.orderId,
            razorpay_payment_id: `demo_payment_${Date.now()}`,
            razorpay_signature: 'demo_signature',
            orderId: orderDetails.orderId,
            mockMode: true
          })
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          toast.success('Payment successful! (Demo Mode)');
          onPaymentSuccess();
          onClose();
        } else {
          toast.error('Payment verification failed');
        }
        setProcessing(false);
        return;
      }

      // REAL RAZORPAY MODE
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'Jain Sahab Special',
          description: 'Order Payment',
          order_id: data.orderId,
          handler: async function (response) {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderDetails.orderId
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful!');
              onPaymentSuccess();
              onClose();
            } else {
              toast.error('Payment verification failed');
            }
            setProcessing(false);
          },
          prefill: {
            name: orderDetails.customerName || '',
            email: orderDetails.customerEmail || '',
            contact: orderDetails.customerPhone || ''
          },
          theme: {
            color: '#D97706'
          },
          modal: {
            ondismiss: function() {
              setProcessing(false);
              toast.error('Payment cancelled');
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      setProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/payments/confirm-cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderDetails.orderId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order confirmed! Pay on delivery.');
        onPaymentSuccess();
        onClose();
      } else {
        toast.error('Failed to confirm order');
      }
    } catch (error) {
      console.error('COD confirmation error:', error);
      toast.error('Failed to confirm order');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'online') {
      handleOnlinePayment();
    } else if (paymentMethod === 'cod') {
      handleCODPayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Order Total:</span>
            <span className="text-2xl font-bold text-primary-600">
              ₹{orderDetails.totalAmount}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Order ID: #{orderDetails.orderId}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Online Payment */}
          <label
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'online'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary-600"
            />
            <div className="ml-3 flex-1">
              <div className="font-semibold text-gray-900">Online Payment</div>
              <div className="text-sm text-gray-600">
                UPI, Cards, Net Banking, Wallets
              </div>
            </div>
            <div className="text-2xl">💳</div>
          </label>

          {/* Cash on Delivery */}
          <label
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'cod'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary-600"
            />
            <div className="ml-3 flex-1">
              <div className="font-semibold text-gray-900">Cash on Delivery</div>
              <div className="text-sm text-gray-600">
                Pay when you receive your order
              </div>
            </div>
            <div className="text-2xl">💵</div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <span className="mr-1">🔒</span>
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
