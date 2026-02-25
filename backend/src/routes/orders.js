const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { items, payment_method, shipping_address } = req.body;
    const userId = req.user.userId;

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const variantResult = await client.query(
        'SELECT * FROM product_variants WHERE id = $1',
        [item.variantId]
      );

      if (variantResult.rows.length === 0) {
        throw new Error(`Variant ${item.variantId} not found`);
      }

      const variant = variantResult.rows[0];

      if (variant.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for variant ${item.variantId}`);
      }

      const itemTotal = parseFloat(variant.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.price
      });

      // Update stock
      await client.query(
        'UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, variant.id]
      );
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, payment_method, shipping_address, status, payment_status)
       VALUES ($1, $2, $3, $4, 'pending', 'pending')
       RETURNING *`,
      [userId, totalAmount, payment_method, shipping_address]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_variant_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.variantId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      orderId: order.id,
      totalAmount: order.total_amount,
      status: order.status
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', (
              SELECT json_build_object(
                'name_english', p.name_english,
                'name_hindi', p.name_hindi,
                'image_url', p.image_url
              )
              FROM products p
              JOIN product_variants pv ON p.id = pv.product_id
              WHERE pv.id = oi.product_variant_id
            ),
            'variant', (
              SELECT json_build_object(
                'weight', pv.weight,
                'price', pv.price
              )
              FROM product_variants pv
              WHERE pv.id = oi.product_variant_id
            )
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.*,
        json_build_object(
          'name', u.name,
          'email', u.email,
          'phone', u.phone
        ) as customer,
        json_agg(
          json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', (
              SELECT json_build_object(
                'name_english', p.name_english,
                'name_hindi', p.name_hindi
              )
              FROM products p
              JOIN product_variants pv ON p.id = pv.product_id
              WHERE pv.id = oi.product_variant_id
            ),
            'variant', (
              SELECT json_build_object('weight', pv.weight)
              FROM product_variants pv
              WHERE pv.id = oi.product_variant_id
            )
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.id
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    let query = `
      SELECT
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', (
              SELECT json_build_object(
                'name_english', p.name_english,
                'name_hindi', p.name_hindi,
                'image_url', p.image_url
              )
              FROM products p
              JOIN product_variants pv ON p.id = pv.product_id
              WHERE pv.id = oi.product_variant_id
            ),
            'variant', (
              SELECT json_build_object(
                'weight', pv.weight,
                'price', pv.price
              )
              FROM product_variants pv
              WHERE pv.id = oi.product_variant_id
            )
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
    `;

    const params = [id];

    if (!isAdmin) {
      query += ' AND o.user_id = $2';
      params.push(userId);
    }

    query += ' GROUP BY o.id';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;

    const result = await pool.query(
      `UPDATE orders
       SET status = $1, tracking_number = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, tracking_number || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get sales statistics (admin)
router.get('/stats/summary', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
      FROM orders
    `);

    const productStats = await pool.query(`
      SELECT COUNT(*) as total_products FROM products
    `);

    const userStats = await pool.query(`
      SELECT COUNT(*) as total_customers FROM users WHERE is_admin = FALSE
    `);

    res.json({
      ...stats.rows[0],
      total_products: productStats.rows[0].total_products,
      total_customers: userStats.rows[0].total_customers
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
