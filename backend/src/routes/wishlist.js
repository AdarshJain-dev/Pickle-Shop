const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user wishlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT
        w.id as wishlist_id,
        p.*,
        json_agg(
          json_build_object(
            'id', pv.id,
            'weight', pv.weight,
            'price', pv.price,
            'stock_quantity', pv.stock_quantity
          )
        ) as variants
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE w.user_id = $1
      GROUP BY w.id, p.id
      ORDER BY w.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const result = await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const result = await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
