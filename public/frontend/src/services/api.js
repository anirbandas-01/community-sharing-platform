// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL;

export const api = {
  // POST request
  post: async (url, data, options = {}) => {
    const headers = {
      'Accept': 'application/json',
      ...options.headers
    };

    // If data is FormData, don't set Content-Type
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      data = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      body: data,
      headers,
      credentials: options.credentials || 'omit',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error or server not responding'
      }));
      throw error;
    }

    return response.json();
  },

  // GET request
  get: async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      credentials: options.credentials || 'omit',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error or server not responding'
      }));
      throw error;
    }

    return response.json();
  },

  // PUT request
  put: async (url, data, options = {}) => {
    const headers = {
      'Accept': 'application/json',
      ...options.headers
    };

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      data = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      body: data,
      headers,
      credentials: options.credentials || 'omit',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error or server not responding'
      }));
      throw error;
    }

    return response.json();
  },

  // DELETE request
  delete: async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      credentials: options.credentials || 'omit',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error or server not responding'
      }));
      throw error;
    }

    return response.json();
  }
};