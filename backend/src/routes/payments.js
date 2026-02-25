const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../db');

// For demo/testing: Mock Razorpay credentials
const RAZORPAY_ENABLED = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
let razorpay = null;

if (RAZORPAY_ENABLED) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // For demo mode (when Razorpay not configured)
    if (!RAZORPAY_ENABLED) {
      // Generate a mock order ID
      const mockOrderId = `mock_order_${Date.now()}`;
      return res.json({
        success: true,
        orderId: mockOrderId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        key: 'rzp_test_demo',
        mockMode: true
      });
    }

    // Real Razorpay integration
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId || Date.now()}`,
      notes: {
        order_id: orderId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      mockMode
    } = req.body;

    // For mock mode (demo/testing)
    if (mockMode || !RAZORPAY_ENABLED) {
      // Simulate successful payment
      if (orderId) {
        await pool.query(
          `UPDATE orders
           SET status = $1, payment_id = $2, payment_method = $3, updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          ['paid', razorpay_payment_id || 'mock_payment_' + Date.now(), 'online', orderId]
        );
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully (Demo Mode)',
        paymentId: razorpay_payment_id || 'mock_payment_' + Date.now()
      });
    }

    // Real Razorpay verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order status to 'paid'
      if (orderId) {
        await pool.query(
          `UPDATE orders
           SET status = $1, payment_id = $2, payment_method = $3, updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          ['paid', razorpay_payment_id, 'online', orderId]
        );
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      // Update order status to 'failed'
      if (orderId) {
        await pool.query(
          `UPDATE orders
           SET status = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          ['failed', orderId]
        );
      }

      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Payment status check
router.get('/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Mock mode
    if (!RAZORPAY_ENABLED || paymentId.startsWith('mock_')) {
      return res.json({
        success: true,
        status: 'captured',
        amount: 0,
        method: 'demo'
      });
    }

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      status: payment.status,
      amount: payment.amount / 100,
      method: payment.method
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// COD order confirmation (no payment required)
router.post('/confirm-cod', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Update order status to 'confirmed' for COD
    await pool.query(
      `UPDATE orders
       SET status = $1, payment_method = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      ['confirmed', 'cod', orderId]
    );

    res.json({
      success: true,
      message: 'COD order confirmed successfully'
    });
  } catch (error) {
    console.error('COD confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm COD order' });
  }
});

module.exports = router;
