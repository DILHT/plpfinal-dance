import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

