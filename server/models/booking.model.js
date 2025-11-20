import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventName: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },
    eventTime: {
        type: String,
        required: [true, 'Event time is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

export default mongoose.model('Booking', bookingSchema);

