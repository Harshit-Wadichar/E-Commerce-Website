const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create item (admin use)
router.post('/', async (req, res) => {
try {
const item = new Item(req.body);
await item.save();
res.json(item);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Update
router.put('/:id', async (req, res) => {
try {
const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(item);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Delete
router.delete('/:id', async (req, res) => {
try {
await Item.findByIdAndDelete(req.params.id);
res.json({ message: 'Deleted' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Get single
router.get('/:id', async (req, res) => {
try {
const item = await Item.findById(req.params.id);
res.json(item);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// List with filters: ?category=foo&minPrice=0&maxPrice=100&search=text&page=1&limit=20&sort=price_asc
router.get('/', async (req, res) => {
try {
const { category, minPrice, maxPrice, search, page = 1, limit = 20, sort } = req.query;
const q = {};
if (category) q.category = category;
if (minPrice) q.price = { ...(q.price || {}), $gte: Number(minPrice) };
if (maxPrice) q.price = { ...(q.price || {}), $lte: Number(maxPrice) };
if (search) q.title = { $regex: search, $options: 'i' };


let cursor = Item.find(q);
// Sorting
if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
else if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });
else cursor = cursor.sort({ createdAt: -1 });


const skip = (Number(page) - 1) * Number(limit);
const total = await Item.countDocuments(q);
const items = await cursor.skip(skip).limit(Number(limit));
res.json({ items, total, page: Number(page), limit: Number(limit) });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;