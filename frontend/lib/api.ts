import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });

          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Disputes API methods
export const disputesAPI = {
  create: (data: any) => api.post('/disputes/create', data),
  getHistory: () => api.get('/disputes/history'),
  getById: (id: string) => api.get(`/disputes/${id}`),
  update: (id: string, data: any) => api.patch(`/disputes/${id}`, data),
  delete: (id: string) => api.delete(`/disputes/${id}`),
  updateStatus: (id: string, status: string, adminNotes?: string) => 
    api.put(`/disputes/${id}/status`, { status, adminNotes }),
};

// Users API methods
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getMe: () => api.get('/users/me'),
};

// Credit Profile API methods
export const creditProfileAPI = {
  getByUserId: (userId: string) => api.get(`/credit-profile/${userId}`),
};

// AI API methods
export const aiAPI = {
  generateLetter: (data: any) => api.post('/ai/generate-letter', data),
};
