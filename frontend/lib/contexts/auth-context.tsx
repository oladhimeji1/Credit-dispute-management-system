'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    setupTokenRefresh();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        // Token is invalid, try to refresh
        await refreshToken();
      }
    }
    setIsLoading(false);
  };

  const setupTokenRefresh = () => {
    // Set up automatic token refresh before expiration
    const token = localStorage.getItem('accessToken');
    if (token) {
      // JWT tokens expire in 15 minutes, refresh every 14 minutes
      setInterval(refreshToken, 14 * 60 * 1000);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token, refresh_token, user: newUser } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshTokenValue}` }
      });
      
      const { access_token, refresh_token, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
    } catch (error) {
      // Refresh failed, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await api.post('/auth/logout', { userId: user.id });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      refreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}