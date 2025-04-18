import { useState, useEffect, useContext, createContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token validity and load user data on init
  useEffect(() => {
    const validateTokenAndLoadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // If no token, user is not logged in
        if (!token) {
          console.log('No token found, user is not authenticated');
          setLoading(false);
          return;
        }
        
        // Try to get current user from localStorage first
        const cachedUser = api.getCurrentUser();
        if (cachedUser) {
          console.log('Found cached user:', cachedUser);
          setUser(cachedUser);
        }
        
        try {
          // Verify token validity by making API call to get current user data
          const response = await api.axiosInstance.get('/auth/me');
          const userData = response.data;
          
          console.log('Token is valid, got user data:', userData);
          
          // Update user in state and localStorage if different from cached
          if (JSON.stringify(userData) !== JSON.stringify(cachedUser)) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        } catch (apiError) {
          console.error('Failed to validate token:', apiError);
          
          // If token is invalid (401), clear auth state
          if (apiError.response && apiError.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setError('Session expired. Please login again.');
          }
        }
      } catch (error) {
        console.error('Error in token validation:', error);
      } finally {
        setLoading(false);
      }
    };

    validateTokenAndLoadUser();
  }, []);

  const login = async (usernameOrEmail, password) => {
    console.log('useAuth: login called with:', usernameOrEmail);
    setLoading(true);
    setError(null);
    try {
      const data = await api.login({ usernameOrEmail, password });
      console.log('useAuth: login successful, data:', data);
      
      // Đảm bảo dữ liệu user được set đúng dựa trên cấu trúc response
      if (data && data.user) {
        setUser(data.user);
        console.log('useAuth: User data has been set', data.user);
      } else if (data && data.userInfo) {
        setUser(data.userInfo);
        console.log('useAuth: User data has been set from userInfo', data.userInfo);
      } else {
        console.error('useAuth: Invalid user data structure received');
        throw new Error('Invalid user data received from server');
      }
      
      // Trả về user để component calling có thể sử dụng
      return data.user || data.userInfo;
    } catch (err) {
      console.error('useAuth: login error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('useAuth: logout called');
    api.logout();
    setUser(null);
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateUserProfile(profileData);
      const updatedUser = response.data;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRoles) => {
    if (!user || !user.roles) return false;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    return user.roles.some(role => requiredRoles.includes(role));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        loading,
        error, 
        login, 
        logout, 
        register,
        updateProfile,
        isAuthenticated: !!user,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 