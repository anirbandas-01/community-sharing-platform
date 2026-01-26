// src/services/auth.js
import { api } from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    return api.post('/api/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return api.post('/api/login', credentials);
  },

  // Logout user
  logout: async () => {
    const token = localStorage.getItem('auth_token');
    return api.post('/api/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    return api.get('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  // Store auth data
  storeAuthData: (data) => {
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored user data
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};