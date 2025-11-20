import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import config from '../config/config.js';
import { sendError } from '../utils/response.util.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return sendError(res, 401, 'Not authorized to access this route');
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return sendError(res, 401, 'User not found');
        }

        next();
    } catch (error) {
        return sendError(res, 401, 'Not authorized to access this route');
    }
};

// Check if user is member or admin
export const requireMember = async (req, res, next) => {
    if (!req.user) {
        return sendError(res, 401, 'Authentication required');
    }

    if (req.user.status !== 'approved' || (req.user.role !== 'member' && req.user.role !== 'admin')) {
        return sendError(res, 403, 'Only approved members can access this resource');
    }

    next();
};

// Check if user is admin
export const requireAdmin = async (req, res, next) => {
    if (!req.user) {
        return sendError(res, 401, 'Authentication required');
    }

    if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Admin access required');
    }

    next();
};

