import express from 'express';
import { getApprovedDancers, getPendingUsers, approveUser, rejectUser, updateProfile } from '../controllers/user.controller.js';
import { protect, requireMember, requireAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

// Public routes
router.get('/dancers', getApprovedDancers);

// Member routes
router.put('/profile', protect, requireMember, upload.single('profilePic'), updateProfile);

// Admin routes
router.get('/pending', protect, requireAdmin, getPendingUsers);
router.put('/:userId/approve', protect, requireAdmin, approveUser);
router.put('/:userId/reject', protect, requireAdmin, rejectUser);

export default router;

