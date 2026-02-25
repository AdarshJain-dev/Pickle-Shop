const { pool } = require('./db');

const seedProducts = async () => {
  const client = await pool.connect();
  try {
    // Check if products already exist
    const existing = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(existing.rows[0].count) > 0) {
      console.log('Products already exist, skipping seed');
      return;
    }

    await client.query('BEGIN');

    // Pickle products
    const pickles = [
      {
        name_english: 'Mango Pickle',
        name_hindi: 'आम का अचार',
        description: 'Traditional Indian mango pickle made with raw mangoes, aromatic spices, and mustard oil. Perfect accompaniment for parathas, rice, and curries.',
        category: 'pickle',
        image_url: '/uploads/mango-pickle.jpg',
        ingredients: 'Raw Mango, Mustard Oil, Salt, Red Chili, Turmeric, Fenugreek, Fennel Seeds, Mustard Seeds',
        shelf_life: '12 months',
        storage_instructions: 'Store in a cool, dry place. Always use a dry spoon.'
      },
      {
        name_english: 'Lemon Pickle',
        name_hindi: 'निम्बू का अचार',
        description: 'Tangy and spicy lemon pickle prepared with fresh lemons and authentic Indian spices. A burst of flavor in every bite.',
        category: 'pickle',
        image_url: '/uploads/lemon-pickle.jpg',
        ingredients: 'Lemon, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek Seeds, Asafoetida',
        shelf_life: '12 months',
        storage_instructions: 'Store in a cool, dry place. Always use a dry spoon.'
      },
      {
        name_english: 'Lemon Chili Pickle',
        name_hindi: 'निम्बू मिर्ची का अचार',
        description: 'Fiery and tangy combination of lemon and green chilies. Perfect for spice lovers who want an extra kick with their meals.',
        category: 'pickle',
        image_url: '/uploads/lemon-chili-pickle.jpg',
        ingredients: 'Lemon, Green Chili, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Mustard Seeds',
        shelf_life: '12 months',
        storage_instructions: 'Store in a cool, dry place. Always use a dry spoon.'
      },
      {
        name_english: 'Amla Pickle',
        name_hindi: 'आंवला का अचार',
        description: 'Nutritious and delicious Indian gooseberry pickle packed with Vitamin C. Tangy, spicy, and incredibly healthy.',
        category: 'pickle',
        image_url: '/uploads/amla-pickle.jpg',
        ingredients: 'Amla (Indian Gooseberry), Mustard Oil, Salt, Red Chili, Turmeric, Fenugreek, Cumin Seeds',
        shelf_life: '12 months',
        storage_instructions: 'Store in a cool, dry place. Always use a dry spoon.'
      }
    ];

    // Insert pickles
    for (const pickle of pickles) {
      const result = await client.query(
        `INSERT INTO products
         (name_english, name_hindi, description, category, image_url, ingredients, shelf_life, storage_instructions)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          pickle.name_english,
          pickle.name_hindi,
          pickle.description,
          pickle.category,
          pickle.image_url,
          pickle.ingredients,
          pickle.shelf_life,
          pickle.storage_instructions
        ]
      );

      const productId = result.rows[0].id;

      // Add variants based on product
      let variants = [];
      if (pickle.name_english === 'Mango Pickle' || pickle.name_english === 'Lemon Pickle') {
        variants = [
          { weight: '1 kg', price: 120, stock: 50 },
          { weight: '500 g', price: 70, stock: 100 }
        ];
      } else if (pickle.name_english === 'Lemon Chili Pickle') {
        variants = [
          { weight: '1 kg', price: 150, stock: 40 },
          { weight: '500 g', price: 80, stock: 80 }
        ];
      } else if (pickle.name_english === 'Amla Pickle') {
        variants = [
          { weight: '1 kg', price: 140, stock: 45 },
          { weight: '500 g', price: 75, stock: 90 }
        ];
      }

      for (const variant of variants) {
        const sku = `JSS-${pickle.name_english.substring(0, 3).toUpperCase()}-${variant.weight.replace(' ', '')}`;
        await client.query(
          'INSERT INTO product_variants (product_id, weight, price, stock_quantity, sku) VALUES ($1, $2, $3, $4, $5)',
          [productId, variant.weight, variant.price, variant.stock, sku]
        );
      }
    }

    // Achaar Masala
    const masala = {
      name_english: 'Jain Sahab Special Achaar Masala',
      name_hindi: 'जैन साहब स्पेशल अचार मसाला',
      description: 'Premium blend of traditional Indian spices specially crafted for making authentic pickles at home. Made with handpicked spices roasted to perfection.',
      category: 'masala',
      image_url: '/uploads/achaar-masala.jpg',
      ingredients: 'Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric, Red Chili, Black Salt, Asafoetida, Nigella Seeds',
      usage_instructions: 'Mix 2-3 tablespoons of masala per kg of vegetable/fruit. Add salt and oil as required. Let it marinate in sunlight for 7-10 days.',
      shelf_life: '18 months',
      storage_instructions: 'Store in an airtight container in a cool, dry place away from direct sunlight.'
    };

    const masalaResult = await client.query(
      `INSERT INTO products
       (name_english, name_hindi, description, category, image_url, ingredients, usage_instructions, shelf_life, storage_instructions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        masala.name_english,
        masala.name_hindi,
        masala.description,
        masala.category,
        masala.image_url,
        masala.ingredients,
        masala.usage_instructions,
        masala.shelf_life,
        masala.storage_instructions
      ]
    );

    const masalaId = masalaResult.rows[0].id;

    // Masala variants
    const masalaVariants = [
      { weight: '200 g', price: 80, stock: 100 },
      { weight: '500 g', price: 180, stock: 80 },
      { weight: '1 kg', price: 320, stock: 50 }
    ];

    for (const variant of masalaVariants) {
      const sku = `JSS-MASALA-${variant.weight.replace(' ', '')}`;
      await client.query(
        'INSERT INTO product_variants (product_id, weight, price, stock_quantity, sku) VALUES ($1, $2, $3, $4, $5)',
        [masalaId, variant.weight, variant.price, variant.stock, sku]
      );
    }

    await client.query('COMMIT');
    console.log('Products seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed error:', error);
  } finally {
    client.release();
  }
};

module.exports = { seedProducts };
