const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all products with variants
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = `
      SELECT
        p.*,
        json_agg(
          json_build_object(
            'id', pv.id,
            'weight', pv.weight,
            'price', pv.price,
            'stock_quantity', pv.stock_quantity,
            'sku', pv.sku
          )
        ) as variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE 1=1
    `;

    const params = [];

    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name_english ILIKE $${params.length} OR p.name_hindi ILIKE $${params.length})`;
    }

    query += ` GROUP BY p.id ORDER BY p.id`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        p.*,
        json_agg(
          json_build_object(
            'id', pv.id,
            'weight', pv.weight,
            'price', pv.price,
            'stock_quantity', pv.stock_quantity,
            'sku', pv.sku
          )
        ) as variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      name_english,
      name_hindi,
      description,
      category,
      ingredients,
      usage_instructions,
      shelf_life,
      storage_instructions,
      variants
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Insert product
    const productResult = await client.query(
      `INSERT INTO products
       (name_english, name_hindi, description, category, image_url, ingredients, usage_instructions, shelf_life, storage_instructions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name_english, name_hindi, description, category, image_url, ingredients, usage_instructions, shelf_life, storage_instructions]
    );

    const product = productResult.rows[0];

    // Insert variants
    if (variants) {
      const variantsArray = JSON.parse(variants);
      for (const variant of variantsArray) {
        await client.query(
          'INSERT INTO product_variants (product_id, weight, price, stock_quantity, sku) VALUES ($1, $2, $3, $4, $5)',
          [product.id, variant.weight, variant.price, variant.stock_quantity || 0, variant.sku]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(product);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  } finally {
    client.release();
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_english,
      name_hindi,
      description,
      category,
      ingredients,
      usage_instructions,
      shelf_life,
      storage_instructions
    } = req.body;

    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE products
       SET name_english = $1, name_hindi = $2, description = $3, category = $4,
           image_url = $5, ingredients = $6, usage_instructions = $7,
           shelf_life = $8, storage_instructions = $9
       WHERE id = $10
       RETURNING *`,
      [name_english, name_hindi, description, category, image_url, ingredients, usage_instructions, shelf_life, storage_instructions, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update variant (admin only)
router.put('/variants/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, price, stock_quantity, sku } = req.body;

    const result = await pool.query(
      'UPDATE product_variants SET weight = $1, price = $2, stock_quantity = $3, sku = $4 WHERE id = $5 RETURNING *',
      [weight, price, stock_quantity, sku, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update variant error:', error);
    res.status(500).json({ error: 'Failed to update variant' });
  }
});

module.exports = router;
