import MindTalk from '../models/mindtalk.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// Get all posts (public can view)
export const getAllPosts = async (req, res) => {
    try {
        const posts = await MindTalk.find()
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });

        // Hide author info if anonymous
        const formattedPosts = posts.map(post => ({
            ...post.toObject(),
            author: post.anonymous ? null : post.author
        }));

        sendSuccess(res, 200, 'Posts retrieved successfully', { posts: formattedPosts });
    } catch (error) {
        console.error('Get posts error:', error);
        sendError(res, 500, 'Error retrieving posts');
    }
};

// Create post (members only)
export const createPost = async (req, res) => {
    try {
        const { text, category } = req.body;
        const userId = req.user.id;

        const post = await MindTalk.create({
            text,
            category: category || 'general',
            anonymous: true,
            author: userId
        });

        const populatedPost = await MindTalk.findById(post._id)
            .populate('author', 'name profilePic');

        sendSuccess(res, 201, 'Post created successfully', { post: populatedPost });
    } catch (error) {
        console.error('Create post error:', error);
        sendError(res, 500, 'Error creating post');
    }
};

// Add reaction (members only)
export const addReaction = async (req, res) => {
    try {
        const { postId } = req.params;
        const { type } = req.body;
        const userId = req.user.id;

        const post = await MindTalk.findById(postId);
        if (!post) {
            return sendError(res, 404, 'Post not found');
        }

        // Remove existing reaction from this user
        post.reactions = post.reactions.filter(
            r => r.user.toString() !== userId.toString()
        );

        // Add new reaction
        post.reactions.push({ user: userId, type: type || 'like' });
        await post.save();

        sendSuccess(res, 200, 'Reaction added successfully', { post });
    } catch (error) {
        console.error('Add reaction error:', error);
        sendError(res, 500, 'Error adding reaction');
    }
};

// Add comment (members only)
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const post = await MindTalk.findById(postId);
        if (!post) {
            return sendError(res, 404, 'Post not found');
        }

        post.comments.push({
            user: userId,
            text
        });

        await post.save();

        const populatedPost = await MindTalk.findById(postId)
            .populate('comments.user', 'name profilePic');

        sendSuccess(res, 200, 'Comment added successfully', { post: populatedPost });
    } catch (error) {
        console.error('Add comment error:', error);
        sendError(res, 500, 'Error adding comment');
    }
};

// Delete post (admin only)
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await MindTalk.findByIdAndDelete(postId);
        if (!post) {
            return sendError(res, 404, 'Post not found');
        }

        sendSuccess(res, 200, 'Post deleted successfully');
    } catch (error) {
        console.error('Delete post error:', error);
        sendError(res, 500, 'Error deleting post');
    }
};

