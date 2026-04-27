import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import riderRoute from './routes/riderRoute.js';
import adminRoutes from './routes/adminroutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoints
app.use('/api/rider', riderRoute);
app.use('/api/admin', adminRoutes); 

app.get('/', (req, res) => {
  res.send('Delivery Backend is WORKING');
});

const port = process.env.PORT || 4080;
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅ Delivery Service DB Connected');
    })
    .catch((err) => {
      console.error('❌ DB Error:', err);
    });
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`);
});

export default app;
