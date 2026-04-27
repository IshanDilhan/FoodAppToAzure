import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import restaurantRoutes from './routes/restaurantroutes.js';
import adminRoutes from "./routes/adminroutes.js";
import menuRoutes from "./routes/menuroutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Cloudinary
connectCloudinary();

// API Endpoints
app.use('/api/restaurants', restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Restaurant Management Backend is WORKING');
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
  mongoose.connect(mongoURI).then(() => console.log('✅ DB Connected'));
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`);
});

export default app;