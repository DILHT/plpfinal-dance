import express from 'express';
import { joinD4C, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/join', joinD4C);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;

