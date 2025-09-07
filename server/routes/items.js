const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

/**
 * @route   GET /api/items
 * @desc    Get all items with filters (category, price, search, sorting, pagination)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20,
      sort,
    } = req.query;

    // Build query object
    const query = {};
    if (category) query.category = category;
    if (minPrice)
      query.price = { ...(query.price || {}), $gte: Number(minPrice) };
    if (maxPrice)
      query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
    if (search) query.title = { $regex: search, $options: "i" }; // case-insensitive search

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };

    // Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch items
    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      items,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/items/:id
 * @desc    Get single item by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching single item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
