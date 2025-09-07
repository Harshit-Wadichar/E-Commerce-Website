// backend/seed/seedItems.js
// Usage:
//   node seed/seedItems.js        -> inserts items only if collection is empty
//   node seed/seedItems.js --force  -> deletes existing items and inserts fresh set
require('dotenv').config();
const connectDB = require('../config/db');
const Item = require('../models/Item');

const items = [
  {
    title: "Classic T-Shirt",
    description: "Comfortable cotton tee — perfect for everyday wear.",
    price: 199,
    category: "clothing"
  },
  {
    title: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole.",
    price: 2999,
    category: "footwear"
  },
  {
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life.",
    price: 799,
    category: "electronics"
  },
  {
    title: "Coffee Mug",
    description: "Ceramic coffee mug — 350ml capacity.",
    price: 249,
    category: "home"
  },
  {
    title: "Leather Wallet",
    description: "Premium leather wallet with multiple card slots.",
    price: 899,
    category: "accessories"
  },
  {
    title: "Bluetooth Headphones",
    description: "Wireless headphones with deep bass and long battery life.",
    price: 3499,
    category: "electronics"
  },
  {
    title: "Backpack",
    description: "Durable backpack for travel and daily use.",
    price: 1299,
    category: "bags"
  },
  {
    title: "Wrist Watch",
    description: "Stylish analog wristwatch with leather strap.",
    price: 1999,
    category: "accessories"
  },
  {
    title: "Sunglasses",
    description: "UV protection sunglasses for men and women.",
    price: 599,
    category: "accessories"
  },
  {
    title: "Gaming Keyboard",
    description: "Mechanical keyboard with RGB lighting.",
    price: 2499,
    category: "electronics"
  },
  {
    title: "Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    price: 5499,
    category: "furniture"
  },
  {
    title: "Cookware Set",
    description: "Non-stick cookware set with 5 essential pieces.",
    price: 2199,
    category: "kitchen"
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
