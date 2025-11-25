import api from './api';

export const getAllPosts = async () => {
  try {
    const response = await api.get('/mindtalk');
    console.log('All posts loaded:', response.data);
    return response.data.data?.posts || response.data.posts || response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/mindtalk', postData);
    console.log('Post created:', response.data);
    return response.data.data?.post || response.data.post || response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const addReaction = async (postId, type = 'like') => {
  try {
    const response = await api.post(`/mindtalk/${postId}/reactions`, { type });
    console.log('Reaction API response:', response.data);
    return response.data.data?.post || response.data.post || response.data;
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

export const addComment = async (postId, text) => {
  try {
    const response = await api.post(`/mindtalk/${postId}/comments`, { text });
    console.log('Comment added:', response.data);
    return response.data.data?.post || response.data.post || response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/mindtalk/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

