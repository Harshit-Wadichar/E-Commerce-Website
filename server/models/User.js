const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  qty: { type: Number, default: 1 },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [CartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
