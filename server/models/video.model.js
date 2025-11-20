import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required']
    },
    thumbnail: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    danceStyle: {
        type: String,
        trim: true
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Video', videoSchema);

