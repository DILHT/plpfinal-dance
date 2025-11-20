import express from 'express';
import { getAllVideos, getUserVideos, uploadVideo, deleteVideo } from '../controllers/video.controller.js';
import { protect, requireMember, requireAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

// Public routes
router.get('/', getAllVideos);
router.get('/user/:userId', getUserVideos);

// Member routes
router.post('/', protect, requireMember, upload.single('video'), uploadVideo);
router.get('/my-videos', protect, requireMember, getUserVideos);

// Admin routes
router.delete('/:videoId', protect, requireAdmin, deleteVideo);

export default router;

