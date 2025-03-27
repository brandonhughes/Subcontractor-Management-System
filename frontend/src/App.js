import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

// Layout Components
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import SubcontractorList from './pages/admin/SubcontractorList';
import SubcontractorForm from './pages/admin/SubcontractorForm';
import UserManagement from './pages/admin/UserManagement';
import QuestionnaireManagement from './pages/admin/QuestionnaireManagement';

// Internal User Pages
import InternalDashboard from './pages/internal/Dashboard';
import SubcontractorDetails from './pages/internal/SubcontractorDetails';
import ReviewForm from './pages/internal/ReviewForm';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  const { isAuthenticated, currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated 
          ? <Navigate to={currentUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
          : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated 
          ? <Navigate to={currentUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
          : <Register />
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="subcontractors" element={<SubcontractorList />} />
        <Route path="subcontractors/new" element={<SubcontractorForm />} />
        <Route path="subcontractors/edit/:id" element={<SubcontractorForm />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="questionnaire" element={<QuestionnaireManagement />} />
      </Route>

      {/* Internal user routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<InternalDashboard />} />
        <Route path="subcontractors/:id" element={<SubcontractorDetails />} />
        <Route path="reviews/new/:subcontractorId" element={<ReviewForm />} />
        <Route path="reviews/edit/:reviewId" element={<ReviewForm />} />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={
        isAuthenticated 
          ? <Navigate to={currentUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default App;