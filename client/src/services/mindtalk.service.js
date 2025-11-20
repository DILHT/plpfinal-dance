import api from './api';

export const getAllPosts = async () => {
  const response = await api.get('/mindtalk');
  return response.data.data.posts;
};

export const createPost = async (postData) => {
  const response = await api.post('/mindtalk', postData);
  return response.data.data.post;
};

export const addReaction = async (postId, type) => {
  const response = await api.post(`/mindtalk/${postId}/reactions`, { type });
  return response.data.data.post;
};

export const addComment = async (postId, text) => {
  const response = await api.post(`/mindtalk/${postId}/comments`, { text });
  return response.data.data.post;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/mindtalk/${postId}`);
  return response.data;
};

