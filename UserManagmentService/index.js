import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import allReviewRoutes from "./routes/allReviewRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("*/auth", userRoutes);
app.use("*/reviews", reviewRoutes);
app.use("*/all", allReviewRoutes);

app.get('/', (req, res) => {
  res.send('User Management Backend WORKING');
});

// DATABASE
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
  mongoose.connect(mongoURI).then(() => console.log('✅ DB Connected'));
}

// IMPORTANT: Do NOT use app.listen() here for Azure Functions
export default app;
