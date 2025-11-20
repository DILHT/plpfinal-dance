import mongoose from 'mongoose';

const mindTalkSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Post text is required'],
        trim: true,
        maxlength: 2000
    },
    category: {
        type: String,
        enum: ['anxiety', 'depression', 'stress', 'motivation', 'gratitude', 'general'],
        default: 'general'
    },
    anonymous: {
        type: Boolean,
        default: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        type: {
            type: String,
            enum: ['like', 'support', 'love']
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('MindTalk', mindTalkSchema);

