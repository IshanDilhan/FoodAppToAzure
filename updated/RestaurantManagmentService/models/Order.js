import mongoose from "mongoose";

const SideSchema = new mongoose.Schema({
  name: String,
  price: Number,
  label: String,
});

const OrderItemSchema = new mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: Number,
  sides: [SideSchema],
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [OrderItemSchema],
  address: { type: String, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "pending", // waiting for restaurant to accept
      "accepted",
      "preparing",
      "ready",
      "waiting-for-delivery",
      "picked-up",
      "delivered",
      "completed",
      "declined"
    ],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);
