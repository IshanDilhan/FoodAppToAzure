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
app.use("/api/auth", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/all", allReviewRoutes);

app.get('/', (req, res) => {
  res.send('User Management Backend WORKING');
});

// DATABASE
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
  mongoose
    .connect(mongoURI)
    .then(() => console.log('✅ User Service DB Connected'))
    .catch((err) => console.error('❌ User Service DB Connection Error:', err));
}

const port = process.env.PORT || 4010;
app.listen(port, '0.0.0.0', () => {
    console.log(`User Service is running on port: ${port}`);
});

// WORKAROUND: satisfy Azure probes looking at port 4000
if (port != 4000) {
    app.listen(4000, '0.0.0.0', () => {
        console.log(`Probes listener running on port: 4000`);
    });
}

export default app;
