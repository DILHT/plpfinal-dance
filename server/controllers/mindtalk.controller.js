import MindTalk from '../models/mindtalk.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { getIO } from '../socket.js';

// Get all posts (public can view)
export const getAllPosts = async (req, res) => {
    try {
        const posts = await MindTalk.find()
            .populate('author', 'name profilePic')
            .populate('reactions.user', 'name profilePic')
            .populate('comments.user', 'name profilePic')
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
        const { text, category, anonymous } = req.body;
        const userId = req.user.id;

        console.log('Creating post:', { text, category, anonymous, userId });

        const post = await MindTalk.create({
            text,
            category: category || 'general',
            anonymous: anonymous !== undefined ? anonymous : true,
            author: userId
        });

        const populatedPost = await MindTalk.findById(post._id)
            .populate('author', 'name profilePic')
            .populate('reactions.user', 'name profilePic')
            .populate('comments.user', 'name profilePic');

        // Format post for response
        const formattedPost = {
            ...populatedPost.toObject(),
            author: populatedPost.anonymous ? null : populatedPost.author
        };

        // Emit real-time update
        try {
            const io = getIO();
            io.to('mindtalk').emit('new-post', formattedPost);
            console.log('Emitted new-post event to mindtalk room');
        } catch (error) {
            console.error('Error emitting socket event:', error);
        }

        sendSuccess(res, 201, 'Post created successfully', { post: formattedPost });
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

        console.log('Adding reaction:', { postId, type, userId });

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

        // Populate the post with user data before sending
        const populatedPost = await MindTalk.findById(postId)
            .populate('author', 'name profilePic')
            .populate('reactions.user', 'name profilePic')
            .populate('comments.user', 'name profilePic');

        // Format post for response
        const formattedPost = {
            ...populatedPost.toObject(),
            author: populatedPost.anonymous ? null : populatedPost.author
        };

        // Emit real-time update
        try {
            const io = getIO();
            io.to('mindtalk').emit('post-updated', formattedPost);
            console.log('Emitted post-updated event to mindtalk room');
        } catch (error) {
            console.error('Error emitting socket event:', error);
        }

        sendSuccess(res, 200, 'Reaction added successfully', { post: formattedPost });
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

        console.log('Adding comment:', { postId, text, userId });

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
            .populate('author', 'name profilePic')
            .populate('reactions.user', 'name profilePic')
            .populate('comments.user', 'name profilePic');

        // Format post for response
        const formattedPost = {
            ...populatedPost.toObject(),
            author: populatedPost.anonymous ? null : populatedPost.author
        };

        // Emit real-time update
        try {
            const io = getIO();
            io.to('mindtalk').emit('post-updated', formattedPost);
            console.log('Emitted post-updated event to mindtalk room');
        } catch (error) {
            console.error('Error emitting socket event:', error);
        }

        sendSuccess(res, 200, 'Comment added successfully', { post: formattedPost });
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

        // Emit real-time update
        try {
            const io = getIO();
            io.to('mindtalk').emit('post-deleted', { postId });
            console.log('Emitted post-deleted event to mindtalk room');
        } catch (error) {
            console.error('Error emitting socket event:', error);
        }

        sendSuccess(res, 200, 'Post deleted successfully');
    } catch (error) {
        console.error('Delete post error:', error);
        sendError(res, 500, 'Error deleting post');
    }
};