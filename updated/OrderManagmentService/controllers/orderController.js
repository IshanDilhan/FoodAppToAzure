import "../models/User.js";
import "../models/restaurantmodel.js";
import "../models/menumodel.js"; 
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";
import axios from "axios";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// Fetch restaurant details (for future use)
async function fetchRestaurant(restaurantId) {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE_URL}/restaurant/${restaurantId}`);
    return response.data.data || null;
  } catch (error) {
    console.error("Restaurant fetch failed:", error.message);
    return null;
  }
}

// Fetch user details (for future use)
async function fetchUser(userId) {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/user/${userId}`);
    return response.data.data || null;
  } catch (error) {
    console.error("User fetch failed:", error.message);
    return null;
  }
}

// Place a new order (checkout) - SPLIT by restaurant
export const checkoutOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const {
      address,
      phone,
      paymentMethod,
      deliveryType,
      instructions = "",
      shippingFee = 109
    } = req.body;

    // Validate required fields
    const requiredFields = ["address", "phone", "paymentMethod", "deliveryType"];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    // Validate cart exists
    const cart = await Cart.findOne({ user: req.userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        code: "EMPTY_CART",
        message: "Your cart is empty"
      });
    }

    // Group cart items by restaurant
    const itemsByRestaurant = {};
    cart.items.forEach(item => {
      // Always extract just the ID
      const restId = typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant;
      itemsByRestaurant[restId] = itemsByRestaurant[restId] || [];
      itemsByRestaurant[restId].push(item);
    });

    const createdOrders = [];

    for (const [restaurantId, items] of Object.entries(itemsByRestaurant)) {
      // Prepare items for order
      const validatedItems = items.map(item => ({
        menu: item.menu,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        sides: (item.sides || []).map(side => ({
          name: side.name,
          price: side.price
        }))
      }));

      // Calculate totals
      const subtotal = validatedItems.reduce(
        (sum, item) =>
          sum +
          (item.price * item.quantity) +
          ((item.sides?.reduce((s, side) => s + side.price, 0) || 0) * item.quantity),
        0
      );
      const total = subtotal + shippingFee;

      // Create order for this restaurant (restaurantId is a string/ObjectId)
      const order = new Order({
        user: req.userId,
        restaurant: restaurantId, // <-- Only the ID!
        address,
        phone,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
        deliveryType,
        instructions,
        shippingFee,
        subtotal,
        total,
        items: validatedItems
      });

      await order.save({ session });
      createdOrders.push(order);
    }

    await Cart.deleteOne({ _id: cart._id }).session(session);
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      orders: createdOrders.map(order => order.toObject())
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      code: error.code || "PROCESSING_ERROR",
      message: error.message || "Checkout processing failed"
    });
  } finally {
    session.endSession();
  }
};

export const stripeCheckout = async (req, res) => {
  try {
    const { address, phone, deliveryType, instructions, shippingFee = 109 } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    // Group cart items by restaurant
    const itemsByRestaurant = {};
    cart.items.forEach(item => {
      const restId = typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant;
      itemsByRestaurant[restId] = itemsByRestaurant[restId] || [];
      itemsByRestaurant[restId].push(item);
    });

    // For simplicity, handle only one restaurant per checkout (expand as needed)
    const [restaurantId, items] = Object.entries(itemsByRestaurant)[0];

    const validatedItems = items.map(item => ({
      menu: item.menu,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      sides: (item.sides || []).map(side => ({
        name: side.name,
        price: side.price
      }))
    }));

    const subtotal = validatedItems.reduce(
      (sum, item) =>
        sum +
        (item.price * item.quantity) +
        ((item.sides?.reduce((s, side) => s + side.price, 0) || 0) * item.quantity),
      0
    );
    const total = subtotal + shippingFee;

    // 1. Create the order in DB with paymentStatus: "pending"
    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      address,
      phone,
      paymentMethod: "stripe",
      paymentStatus: "pending",
      deliveryType,
      instructions,
      shippingFee,
      subtotal,
      total,
      items: validatedItems
    });
    await order.save();

    // 2. Prepare Stripe line items
    const line_items = validatedItems.map(item => ({
      price_data: {
        currency: "lkr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "lkr",
        product_data: { name: "Delivery Fee" },
        unit_amount: Math.round(shippingFee * 100)
      },
      quantity: 1
    });

    // 3. Create Stripe session with orderId in success/cancel URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/checkout-success?success=true&orderId=${order._id}`,
      cancel_url: `${req.headers.origin}/checkout-success?success=false&orderId=${order._id}`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });
      await Cart.deleteOne({ user: req.userId }); // Clear cart after payment
      res.json({ success: true });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};












// Get all orders for logged-in user
export const getOrders = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const orders = await Order.find({ user: req.userId })
      .sort("-createdAt")
      .populate("restaurant", "name logo address email contactNumber coverImage availableTime")
      .populate("items.menu", "name image price")
      .lean();

    const formattedOrders = orders.map(order => ({
      ...order,
      subtotal: order.subtotal?.toFixed(2) || "0.00",
      total: order.total?.toFixed(2) || "0.00",
      shippingFee: order.shippingFee?.toFixed(2) || "0.00",
      createdAt: new Date(order.createdAt).toLocaleString(),
      items: order.items.map(item => ({
        ...item,
        price: item.price?.toFixed(2) || "0.00",
        sides: item.sides?.map(side => ({
          ...side,
          price: side.price?.toFixed(2) || "0.00"
        })) || []
      }))
    }));

    res.json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user orders"
    });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    const orders = await Order.find({ restaurant: restaurantId })
      .sort("-createdAt")
      .populate("user", "name email")
      .populate("items.menu", "name image price")
      .lean();
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch restaurant orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status value (optional)
    const validStatuses = [
      "pending", "confirmed", "processing", "preparing",
      "handover", "out for delivery", "delivered"
    ];
    if (!validStatuses.includes(status?.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const assignRiderToOrder = async (req, res) => {
  try {
    const { orderId, riderId } = req.body;
    if (!orderId || !riderId) return res.status(400).json({ success: false, message: "Order and Rider required" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    order.assignedRider = riderId;
    order.riderStatus = "PENDING";
    await order.save();
    res.json({ success: true, message: "Order assigned to rider", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to assign rider", error: err.message });
  }
};


export const getAssignedOrdersForRider = async (req, res) => {
  try {
    const riderId = req.user.id;
    const orders = await Order.find({ assignedRider: riderId })
      .populate("user", "name")
      .lean();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch assigned orders", error: err.message });
  }
};

export const riderUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    // Validate input
    if (!orderId || !["ACCEPTED", "REJECTED", "PICKED_UP", "DELIVERED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid orderId or status" });
    }

    // Find the order and ensure the rider is assigned to it
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!order.assignedRider || order.assignedRider.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not assigned to this order" });
    }

    // Update riderStatus
    order.riderStatus = status;
    await order.save();

    // Optionally: Notify the restaurant via socket, email, or polling

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update order status", error: err.message });
  }
};
