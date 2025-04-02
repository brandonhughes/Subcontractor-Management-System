import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug API configuration
console.log('API Base URL:', api.defaults.baseURL);

// Check response data for debugging
api.interceptors.response.use(
  (response) => {
    // For debugging subcontractor data
    if (response.config.url.includes('/api/subcontractors') && !response.config.url.includes('/documents')) {
      console.log('Subcontractor API Response:', response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service object for more organized usage
const apiService = {
  // Auth
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/api/auth/me'),
  
  // Users
  getUsers: () => api.get('/api/users'),
  getUser: (id) => api.get(`/api/users/${id}`),
  createUser: (userData) => api.post('/api/users', userData),
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  resetPassword: (id, passwordData) => api.put(`/api/users/${id}/password`, passwordData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  
  // Profile
  updateProfile: (userData) => api.put('/api/users/me', userData),
  changePassword: (passwordData) => api.put('/api/users/me/password', passwordData),
  
  // Subcontractors
  getSubcontractors: () => api.get('/api/subcontractors'),
  getSubcontractor: (id) => api.get(`/api/subcontractors/${id}`),
  createSubcontractor: (data) => api.post('/api/subcontractors', data),
  updateSubcontractor: (id, data) => api.put(`/api/subcontractors/${id}`, data),
  deleteSubcontractor: (id) => api.delete(`/api/subcontractors/${id}`),
  uploadDocument: (id, formData) => api.post(`/api/subcontractors/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteDocument: (subcontractorId, documentId) => api.delete(`/api/subcontractors/${subcontractorId}/documents/${documentId}`),
  
  // Questionnaires
  getQuestionCategories: () => api.get('/api/questions/categories'),
  getQuestionsByCategory: (categoryId) => api.get(`/api/questions/categories/${categoryId}`),
  getAllQuestions: () => api.get('/api/questions'),
  createQuestionCategory: (data) => api.post('/api/questions/categories', data),
  updateQuestionCategory: (id, data) => api.put(`/api/questions/categories/${id}`, data),
  deleteQuestionCategory: (id) => api.delete(`/api/questions/categories/${id}`),
  createQuestion: (data) => api.post('/api/questions', data),
  updateQuestion: (id, data) => api.put(`/api/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/api/questions/${id}`),
  
  // Reviews
  getReviewsBySubcontractor: (subcontractorId) => api.get(`/api/reviews/subcontractor/${subcontractorId}`),
  getReview: (id) => api.get(`/api/reviews/${id}`),
  createReview: (data) => api.post('/api/reviews', data),
  updateReview: (id, data) => api.put(`/api/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),
  uploadReviewAttachment: (reviewId, formData) => api.post(`/api/reviews/${reviewId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteReviewAttachment: (reviewId, attachmentId) => api.delete(`/api/reviews/${reviewId}/attachments/${attachmentId}`),
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