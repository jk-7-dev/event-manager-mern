import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

dotenv.config();

const app = express();

app.use(express.json());

// --- 1. UPDATED CORS CONFIGURATION ---
// We allow both localhost (for testing) and your future Vercel frontend
app.use(cors({
    origin: [
        "http://localhost:5173", 
        // You will add your Vercel Frontend URL here later (e.g. https://event-manager-ui.vercel.app)
    ],
    credentials: true
}));

// --- 2. UPDATED DB CONNECTION FOR SERVERLESS ---
const connectDB = async () => {
  // Check if we already have a connection to avoid reconnecting
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to DB immediately
connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes); 

// Swagger Docs
const swaggerDocument = yaml.load('./api-docs.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- 3. UPDATED LISTEN LOGIC FOR VERCEL ---
// Only listen to port if we are NOT in production (i.e., running locally)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for Vercel
export default app;