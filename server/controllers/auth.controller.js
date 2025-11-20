import User from '../models/user.model.js';
import { generateToken } from '../utils/token.util.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// Register/Join D4C
export const joinD4C = async (req, res) => {
    try {
        const { name, email, password, danceStyle, bio } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 400, 'User already exists with this email');
        }

        const user = await User.create({
            name,
            email,
            password,
            danceStyle,
            bio,
            role: 'pending',
            status: 'pending'
        });

        sendSuccess(res, 201, 'Application submitted successfully. Your application is under review.', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Join error:', error);
        sendError(res, 500, 'Error submitting application');
    }
};

// Login (only for approved members)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return sendError(res, 401, 'Invalid credentials');
        }

        // Check if user is approved
        if (user.status !== 'approved' || user.role === 'pending') {
            return sendError(res, 403, 'Your application is under review. Only approved members can log in.');
        }

        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return sendError(res, 401, 'Invalid credentials');
        }

        const token = generateToken(user._id);

        sendSuccess(res, 200, 'Login successful', {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                danceStyle: user.danceStyle,
                bio: user.bio,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 500, 'Error logging in');
    }
};

// Get current user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        sendSuccess(res, 200, 'User retrieved successfully', { user });
    } catch (error) {
        console.error('Get me error:', error);
        sendError(res, 500, 'Error retrieving user');
    }
};

