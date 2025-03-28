import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug API configuration
console.log('API Base URL:', api.defaults.baseURL);

// API service object for more organized usage
const apiService = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  
  // Users
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  resetPassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Profile
  updateProfile: (userData) => api.put('/users/me', userData),
  changePassword: (passwordData) => api.put('/users/me/password', passwordData),
};

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid
      localStorage.removeItem('token');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiService };
export default api;