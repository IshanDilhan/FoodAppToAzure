import mongoose from "mongoose";

const SideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  label: { type: String, default: "" },
});

const CartItemSchema = new mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  sides: [SideSchema],
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Cart", CartSchema);
