import Booking from '../models/booking.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .sort({ eventDate: 1 });

        sendSuccess(res, 200, 'Bookings retrieved successfully', { bookings });
    } catch (error) {
        console.error('Get bookings error:', error);
        sendError(res, 500, 'Error retrieving bookings');
    }
};

// Create booking (members only)
export const createBooking = async (req, res) => {
    try {
        const { eventName, eventDate, eventTime, location, notes } = req.body;
        const userId = req.user.id;

        const booking = await Booking.create({
            user: userId,
            eventName,
            eventDate,
            eventTime,
            location,
            notes,
            status: 'pending'
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('user', 'name email');

        sendSuccess(res, 201, 'Booking created successfully', { booking: populatedBooking });
    } catch (error) {
        console.error('Create booking error:', error);
        sendError(res, 500, 'Error creating booking');
    }
};

