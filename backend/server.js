import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

// --- NEW IMPORTS FOR PATH RESOLUTION ---
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// --- DEFINE __dirname FOR ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS Config
app.use(cors({
    origin: ["http://localhost:5173", "https://event-manager-ui.vercel.app"],
    credentials: true
}));

// DB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes); 

// --- FIXED SWAGGER LOADING ---
// We use path.join to create a rock-solid absolute path to the file
try {
  const swaggerDocument = yaml.load(path.join(__dirname, 'api-docs.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error("Could not load API Docs:", error);
}

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}

export default app;