import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';

/**
 * Custom hook for making API requests with authentication
 * Handles loading states, errors, and authentication
 */
export const useApi = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute an API request with proper error handling
   * @param {Function} apiCall - The API call function to execute
   * @param {Object} options - Options for the request
   * @param {boolean} options.showLoading - Whether to show loading state
   * @param {boolean} options.requiresAuth - Whether the request requires authentication
   * @returns {Promise<any>} - The API response data
   */
  const execute = useCallback(async (apiCall, options = { showLoading: true, requiresAuth: true }) => {
    if (options.showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      // Check if authentication is required and token exists
      if (options.requiresAuth && !api.isAuthenticated()) {
        throw new Error('Authentication required');
      }

      const response = await apiCall();
      return response;
    } catch (err) {
      console.error('API Error:', err);
      
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        console.log('Authentication error, logging out');
        logout();
      }
      
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      if (options.showLoading) {
        setLoading(false);
      }
    }
  }, [logout]);

  return {
    loading,
    error,
    execute
  };
};

export default useApi; 