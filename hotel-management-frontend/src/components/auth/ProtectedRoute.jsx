import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

/**
 * ProtectedRoute component for guarding routes that require authentication
 * @param {Object} props - Component props
 * @param {string} props.redirectPath - Path to redirect to if not authenticated
 * @param {JSX.Element} props.element - Route component to render if authenticated
 * @param {Array} props.roles - Array of roles required for access
 * @returns {JSX.Element} - Protected route component
 */
const ProtectedRoute = ({ roles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  console.log(`ProtectedRoute at ${location.pathname}: Authentication check started`);
  console.log(`ProtectedRoute: isAuthenticated = ${isAuthenticated}, loading = ${loading}`);
  
  // Show loading while checking authentication
  if (loading) {
    console.log('ProtectedRoute: Loading authentication state...');
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Check if user has required roles
  if (roles && roles.length > 0) {
    console.log('ProtectedRoute: Checking roles...', roles);
    console.log('ProtectedRoute: User roles...', user.roles);
    
    const hasRequiredRole = user.roles && user.roles.some(role => roles.includes(role));
    
    if (!hasRequiredRole) {
      console.log('ProtectedRoute: User does not have required roles');
      
      // Redirect to appropriate page based on user role
      if (user.roles && user.roles.includes('ROLE_ADMIN')) {
        console.log('ProtectedRoute: User is admin, redirecting to /admin');
        return <Navigate to="/admin" replace />;
      } else {
        console.log('ProtectedRoute: User is not admin, redirecting to /employees');
        return <Navigate to="/employees" replace />;
      }
    }
  }

  console.log(`ProtectedRoute: Access granted to ${location.pathname}, rendering children`);
  return children;
};

export default ProtectedRoute; 