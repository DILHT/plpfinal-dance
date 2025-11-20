import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';

// Import routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import mindtalkRoutes from './routes/mindtalk.route.js';
import videoRoutes from './routes/video.route.js';
import bookingRoutes from './routes/booking.route.js';

// Import error handler
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: config.clientUrl || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mindtalk', mindtalkRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Dance For Change API' });
});

// Error handler
app.use(errorHandler);

export default app;

