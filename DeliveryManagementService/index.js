import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'; // Use 'import' for body-parser
import riderRoute from './routes/riderRoute.js';
import adminRoutes from './routes/adminroutes.js';
import helmet from 'helmet'


const app = express();


const allowedOrigins = [
  
  'http://localhost:5173',
  'https://islandrasa.vercel.app',
  'https://island-rasa-admin-panel.vercel.app'

 

  
];




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || 4080;


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



// Middleware
app.use(express.json());
 app.use(bodyParser.json()); // Parse JSON bodies
 app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect Cloudinary
//connectCloudinary();

// API Endpoints
app.use('/api/rider', riderRoute);
app.use('/api/admin', adminRoutes); 


// Root endpoint
app.get('/', (req, res) => {
  res.send('Delivery Backend is WORKING');
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Delivery Management Service Database  connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the app if DB connection fails
  });

// Start the server
app.listen(port, () => console.log('Server is running on port: ' + port));
