import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import bodyParser from 'body-parser';
import userRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import allReviewRoutes from "./routes/allReviewRoutes.js";
import helmet from 'helmet'

dotenv.config();

const app = express();



const allowedOrigins = [
  
  'http://localhost:5173',
  'http://localhost:3000',      // Admin Frontend (Docker)
  'http://localhost:3001',
  'http://localhost:4000',
  'https://islandrasa.vercel.app',
  'https://island-rasa-admin-panel.vercel.app'

 

  
];
const port = process.env.PORT || 4010;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
      }
    }
  })
);


app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://vercel.live"],
      "default-src": ["'self'"],
    },
  })
);



// Connect Cloudinary
connectCloudinary();

// Routes

app.use("/api/all", allReviewRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/reviews", reviewRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('User Management Backend  WORKING');
});

// MongoDB Connection + Start Server
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log('✅ User & Feedback Management Service Database connected successfully');
  
  // ✅ Start server *after* DB connects
  app.listen(port, () => console.log(`🚀 Server is running on port: ${port}`));
}).catch((err) => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});
