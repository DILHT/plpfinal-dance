import Video from '../models/video.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// Get all videos (public)
export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find({ isPublic: true })
            .populate('author', 'name profilePic danceStyle')
            .sort({ createdAt: -1 });

        sendSuccess(res, 200, 'Videos retrieved successfully', { videos });
    } catch (error) {
        console.error('Get videos error:', error);
        sendError(res, 500, 'Error retrieving videos');
    }
};

// Get user's videos
export const getUserVideos = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);

        if (!userId) {
            return sendError(res, 400, 'User ID is required');
        }

        const videos = await Video.find({ author: userId })
            .populate('author', 'name profilePic danceStyle')
            .sort({ createdAt: -1 });

        sendSuccess(res, 200, 'Videos retrieved successfully', { videos });
    } catch (error) {
        console.error('Get user videos error:', error);
        sendError(res, 500, 'Error retrieving videos');
    }
};

// Upload video (members only)
export const uploadVideo = async (req, res) => {
    try {
        const { title, description, danceStyle } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return sendError(res, 400, 'Video file is required');
        }

        const video = await Video.create({
            title,
            description,
            videoUrl: req.file.path,
            thumbnail: req.file.path, // Cloudinary can generate thumbnails
            author: userId,
            danceStyle,
            isPublic: true
        });

        const populatedVideo = await Video.findById(video._id)
            .populate('author', 'name profilePic danceStyle');

        sendSuccess(res, 201, 'Video uploaded successfully', { video: populatedVideo });
    } catch (error) {
        console.error('Upload video error:', error);
        sendError(res, 500, 'Error uploading video');
    }
};

// Delete video (admin or owner)
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const video = await Video.findById(videoId);
        if (!video) {
            return sendError(res, 404, 'Video not found');
        }

        // Check if user is admin or owner
        if (userRole !== 'admin' && video.author.toString() !== userId.toString()) {
            return sendError(res, 403, 'Not authorized to delete this video');
        }

        await Video.findByIdAndDelete(videoId);

        sendSuccess(res, 200, 'Video deleted successfully');
    } catch (error) {
        console.error('Delete video error:', error);
        sendError(res, 500, 'Error deleting video');
    }
};

