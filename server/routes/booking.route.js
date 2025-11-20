import express from 'express';
import { getAllBookings, createBooking } from '../controllers/booking.controller.js';
import { protect, requireMember, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Member routes
router.post('/', protect, requireMember, createBooking);

// Admin routes
router.get('/', protect, requireAdmin, getAllBookings);

export default router;

