const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Item = require("../models/Item");

/**
 * Helper function: fetch user with cart populated
 */
async function getUserWithCart(userId) {
  return User.findById(userId).populate("cart.item");
}

/**
 * @route   GET /api/cart
 * @desc    Get current user's cart
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await getUserWithCart(req.user._id);
    res.json(user.cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart (or increase quantity if exists)
 * @access  Private
 */
router.post("/add", auth, async (req, res) => {
  try {
    const { itemId, qty = 1 } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const user = await User.findById(req.user._id);

    // Check if item already in cart
    const existing = user.cart.find(ci => ci.item.toString() === itemId);
    if (existing) {
      existing.qty += Number(qty);
    } else {
      user.cart.push({ item: itemId, qty: Number(qty) });
    }

    await user.save();
    const updatedUser = await getUserWithCart(user._id);
    res.json(updatedUser.cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/cart/update
 * @desc    Update item quantity in cart
 * @access  Private
 */
router.put("/update", auth, async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    const user = await User.findById(req.user._id);

    const existing = user.cart.find(ci => ci.item.toString() === itemId);
    if (!existing) return res.status(404).json({ message: "Item not in cart" });

    existing.qty = Number(qty);

    // Remove items with 0 qty
    user.cart = user.cart.filter(ci => ci.qty > 0);

    await user.save();
    const updatedUser = await getUserWithCart(user._id);
    res.json(updatedUser.cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/cart/remove/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete("/remove/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(ci => ci.item.toString() !== itemId);

    await user.save();
    const updatedUser = await getUserWithCart(user._id);
    res.json(updatedUser.cart);
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/cart/merge
 * @desc    Merge local cart (from frontend storage) with user's cart
 * @access  Private
 */
router.post("/merge", auth, async (req, res) => {
  try {
    const { items = [] } = req.body; // items: [{ itemId, qty }]
    const user = await User.findById(req.user._id);

    for (const it of items) {
      const existing = user.cart.find(ci => ci.item.toString() === it.itemId);
      if (existing) {
        existing.qty = Math.max(existing.qty, it.qty); // keep the bigger qty
      } else {
        user.cart.push({ item: it.itemId, qty: it.qty });
      }
    }

    await user.save();
    const updatedUser = await getUserWithCart(user._id);
    res.json(updatedUser.cart);
  } catch (err) {
    console.error("Error merging cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
