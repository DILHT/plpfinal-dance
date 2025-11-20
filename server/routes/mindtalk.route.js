import express from 'express';
import { getAllPosts, createPost, addReaction, addComment, deletePost } from '../controllers/mindtalk.controller.js';
import { protect, requireMember, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route (read-only)
router.get('/', getAllPosts);

// Member routes
router.post('/', protect, requireMember, createPost);
router.post('/:postId/reactions', protect, requireMember, addReaction);
router.post('/:postId/comments', protect, requireMember, addComment);

// Admin routes
router.delete('/:postId', protect, requireAdmin, deletePost);

export default router;

