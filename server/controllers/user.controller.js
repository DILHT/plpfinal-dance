import User from '../models/user.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// Get all approved dancers (public)
export const getApprovedDancers = async (req, res) => {
    try {
        const dancers = await User.find({ 
            status: 'approved',
            role: { $in: ['member', 'admin'] }
        }).select('-password -email');

        sendSuccess(res, 200, 'Dancers retrieved successfully', { dancers });
    } catch (error) {
        console.error('Get dancers error:', error);
        sendError(res, 500, 'Error retrieving dancers');
    }
};

// Get pending users (admin only)
export const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' })
            .select('-password');

        sendSuccess(res, 200, 'Pending users retrieved successfully', { users: pendingUsers });
    } catch (error) {
        console.error('Get pending users error:', error);
        sendError(res, 500, 'Error retrieving pending users');
    }
};

// Approve user (admin only)
export const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        user.status = 'approved';
        user.role = 'member';
        await user.save();

        sendSuccess(res, 200, 'User approved successfully', { user });
    } catch (error) {
        console.error('Approve user error:', error);
        sendError(res, 500, 'Error approving user');
    }
};

// Reject user (admin only)
export const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        user.status = 'rejected';
        await user.save();

        sendSuccess(res, 200, 'User rejected successfully', { user });
    } catch (error) {
        console.error('Reject user error:', error);
        sendError(res, 500, 'Error rejecting user');
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, danceStyle, bio } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        if (name) user.name = name;
        if (danceStyle) user.danceStyle = danceStyle;
        if (bio) user.bio = bio;
        if (req.file) {
            user.profilePic = req.file.path;
        }

        await user.save();

        sendSuccess(res, 200, 'Profile updated successfully', { user });
    } catch (error) {
        console.error('Update profile error:', error);
        sendError(res, 500, 'Error updating profile');
    }
};

