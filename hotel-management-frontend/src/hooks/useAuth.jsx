import { useState, useEffect, useContext, createContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      console.log('Found logged in user:', currentUser);
      setUser(currentUser);
    } else {
      console.log('No logged in user found');
    }
    setLoading(false);
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