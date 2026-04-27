import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import stripeWebhookRouter from "./routes/stripeWebhook.js";

const app = express();

app.use("/api/order/stripe", stripeWebhookRouter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectCloudinary();

app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get('/', (req, res) => {
  res.send('Order Management Backend is WORKING');
});

const port = process.env.PORT || 4040;
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅ Order Service DB Connected');
    })
    .catch((err) => {
      console.error('❌ DB Error:', err);
    });
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`);
});

export default app;
