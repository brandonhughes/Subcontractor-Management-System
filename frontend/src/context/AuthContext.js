import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch current user if token exists
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('Fetching current user...');
        const response = await api.get('/auth/me');
        setCurrentUser(response.data.user);
        setError(null);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError('Failed to authenticate user');
        // Clear token if it's invalid
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with API at:', api.defaults.baseURL);
      const response = await api.post('/auth/login', { username, password });
      
      console.log('Login response:', response);
      const { token, user } = response.data;
      console.log('Login successful:', user);
      
      // Save token and set user
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user);
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setError(null);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      // Save token and set user
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user);
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setError(null);
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear auth state
    setToken(null);
    setCurrentUser(null);
    
    // Clear Authorization header
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};