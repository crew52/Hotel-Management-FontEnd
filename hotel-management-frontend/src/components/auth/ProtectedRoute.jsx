import React from 'react';
import { Navigate, useLocation } from 'react-router';
import authService from '../../services/authService';
import { CircularProgress } from '@mui/material';

/**
 * ProtectedRoute component for guarding routes that require authentication
 * @param {Object} props - Component props
 * @param {string} props.redirectPath - Path to redirect to if not authenticated
 * @param {JSX.Element} props.element - Route component to render if authenticated
 * @param {Array} props.roles - Array of roles required for access
 * @returns {JSX.Element} - Protected route component
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (!authService.isAuthenticated()) {
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

  // Check if user has the required roles
  if (roles.length > 0 && !authService.hasAnyRole(roles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated, render the element
  return children;
};

export default ProtectedRoute; 