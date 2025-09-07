// backend/seed/seedItems.js
// Usage:
//   node seed/seedItems.js        -> inserts items only if collection is empty
//   node seed/seedItems.js --force  -> deletes existing items and inserts fresh set

require('dotenv').config();
const connectDB = require('../config/db');
const Item = require('../models/Item');

const items = [
  {
    title: 'Classic T-Shirt',
    description: 'Comfortable cotton tee — perfect for everyday wear.',
    price: 199,
    category: 'clothing',
    image: 'https://via.placeholder.com/400x300?text=Classic+T-Shirt'
  },
  {
    title: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole.',
    price: 2999,
    category: 'footwear',
    image: 'https://via.placeholder.com/400x300?text=Running+Shoes'
  },
  {
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life.',
    price: 799,
    category: 'electronics',
    image: 'https://via.placeholder.com/400x300?text=Wireless+Mouse'
  },
  {
    title: 'Coffee Mug',
    description: 'Ceramic coffee mug — 350ml capacity.',
    price: 249,
    category: 'home',
    image: 'https://via.placeholder.com/400x300?text=Coffee+Mug'
  }
];

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    if (!MONGO_URI) {
      console.error('Missing MONGO_URI in environment. Copy .env.example to .env and set MONGO_URI.');
      process.exit(1);
    }

    await connectDB(MONGO_URI);

    const force = process.argv.includes('--force') || process.argv.includes('-f');

    if (force) {
      console.log('Force mode enabled: deleting existing items...');
      await Item.deleteMany({});
    }

    const count = await Item.countDocuments();
    if (count > 0 && !force) {
      console.log(`Found ${count} existing item(s). Skipping seed. Use --force to reseed.`);
      await gracefulExit(0);
      return;
    }

    // Insert items
    const inserted = await Item.insertMany(items);
    console.log(`Inserted ${inserted.length} items.`);

    await gracefulExit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    await gracefulExit(1);
  }
})();

async function gracefulExit(code = 0) {
  try {
    // Close mongoose connection if open
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState) {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
    }
  } catch (e) {
    // ignore
  } finally {
    process.exit(code);
  }
}
