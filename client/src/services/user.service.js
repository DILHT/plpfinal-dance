import api from './api';

export const getApprovedDancers = async () => {
  const response = await api.get('/users/dancers');
  return response.data.data.dancers;
};

export const getPendingUsers = async () => {
  const response = await api.get('/users/pending');
  return response.data.data.users;
};

export const approveUser = async (userId) => {
  const response = await api.put(`/users/${userId}/approve`);
  return response.data.data.user;
};

export const rejectUser = async (userId) => {
  const response = await api.put(`/users/${userId}/reject`);
  return response.data.data.user;
};

export const updateProfile = async (formData) => {
  const response = await api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.user;
};

