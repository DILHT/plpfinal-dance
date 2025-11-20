import api from './api';

export const getAllVideos = async () => {
  const response = await api.get('/videos');
  return response.data.data.videos;
};

export const getUserVideos = async (userId) => {
  const response = await api.get(`/videos/user/${userId}`);
  return response.data.data.videos;
};

export const uploadVideo = async (formData) => {
  const response = await api.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.video;
};

export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

