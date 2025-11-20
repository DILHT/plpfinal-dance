import api from './api';

export const joinD4C = async (userData) => {
  const response = await api.post('/auth/join', userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.data.user;
};

