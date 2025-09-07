const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Item = require('../models/Item');


// Get cart
router.get('/', auth, async (req, res) => {
const user = await User.findById(req.user._id).populate('cart.item');
res.json(user.cart);
});

// Add/update item in cart
router.post('/add', auth, async (req, res) => {
try {
const { itemId, qty = 1 } = req.body;
const item = await Item.findById(itemId);
if (!item) return res.status(404).json({ message: 'Item not found' });
const user = await User.findById(req.user._id);
const existing = user.cart.find(ci => ci.item.toString() === itemId);
if (existing) existing.qty += Number(qty);
else user.cart.push({ item: itemId, qty: Number(qty) });
await user.save();
await user.populate('cart.item');
res.json(user.cart);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Update quantity
router.put('/update', auth, async (req, res) => {
try {
const { itemId, qty } = req.body;
const user = await User.findById(req.user._id);
const existing = user.cart.find(ci => ci.item.toString() === itemId);
if (!existing) return res.status(404).json({ message: 'Item not in cart' });
existing.qty = Number(qty);
user.cart = user.cart.filter(ci => ci.qty > 0);
await user.save();
await user.populate('cart.item');
res.json(user.cart);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Remove item
router.delete('/remove/:itemId', auth, async (req, res) => {
try {
const { itemId } = req.params;
const user = await User.findById(req.user._id);
user.cart = user.cart.filter(ci => ci.item.toString() !== itemId);
await user.save();
await user.populate('cart.item');
res.json(user.cart);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Merge local cart (on login): body: { items: [{ itemId, qty }] }
router.post('/merge', auth, async (req, res) => {
try {
const { items = [] } = req.body; // items from localStorage
const user = await User.findById(req.user._id);
for (const it of items) {
const existing = user.cart.find(ci => ci.item.toString() === it.itemId);
if (existing) existing.qty = Math.max(existing.qty, it.qty);
else user.cart.push({ item: it.itemId, qty: it.qty });
}
await user.save();
await user.populate('cart.item');
res.json(user.cart);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;