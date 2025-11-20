import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from '../services/auth.service';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.joinD4C(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

