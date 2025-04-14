import React from 'react';
import { Navigate, Route } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress } from '@mui/material';

/**
 * ProtectedRoute component for guarding routes that require authentication
 * @param {Object} props - Component props
 * @param {string} props.redirectPath - Path to redirect to if not authenticated
 * @param {boolean} props.requireAdmin - Whether this route requires admin role
 * @param {JSX.Element} props.element - Route component to render if authenticated
 * @returns {JSX.Element} - Protected route component
 */
const ProtectedRoute = ({ 
  redirectPath = '/login',
  requireAdmin = false,
  element
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check for admin role if required
  if (requireAdmin && !(user?.role === 'admin' || user?.role === 'ADMIN')) {
    return <Navigate to="/employed" replace />;
  }

  // User is authenticated, render the element
  return element;
};

export default ProtectedRoute; 