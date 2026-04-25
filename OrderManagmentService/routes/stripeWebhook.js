import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const {
        userId,
        address,
        phone,
        deliveryType,
        instructions,
        shippingFee,
        subtotal,
        total
      } = session.metadata;

      const cart = await Cart.findOne({ user: userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "No cart found for user" });
      }

      const itemsByRestaurant = {};
      cart.items.forEach(item => {
        const restId = typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant;
        itemsByRestaurant[restId] = itemsByRestaurant[restId] || [];
        itemsByRestaurant[restId].push(item);
      });

      for (const [restaurantId, items] of Object.entries(itemsByRestaurant)) {
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

        const order = new Order({
          user: userId,
          restaurant: restaurantId,
          address,
          phone,
          paymentMethod: "stripe",
          paymentStatus: "paid",
          deliveryType,
          instructions,
          shippingFee,
          subtotal,
          total,
          items: validatedItems
        });

        await order.save();
      }

      await Cart.deleteOne({ user: userId });
    }

    res.json({ received: true });
  }
);

export default router;
