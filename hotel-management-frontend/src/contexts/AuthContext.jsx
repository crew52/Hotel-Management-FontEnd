import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize - check if user is already logged in
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (usernameOrEmail, password) => {
    console.log('AuthContext: Login function called');
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Calling authService.login');
      const data = await authService.login(usernameOrEmail, password);
      console.log('AuthContext: Login successful, data:', data);
      
      // Nếu không có user data, không thể tiếp tục
      if (!data.user) {
        throw new Error('Không nhận được thông tin người dùng');
      }
      
      setUser(data.user);
      
      // Redirect user based on role
      if (data.user && data.user.roles) {
        console.log('AuthContext: User roles detected:', data.user.roles);
        // Nếu người dùng có role ADMIN
        if (data.user.roles.some(role => role.name === 'ROLE_ADMIN')) {
          console.log('AuthContext: Redirecting to /admin');
          navigate('/admin');
        } 
        // Các vai trò khác
        else {
          console.log('AuthContext: Redirecting to /employed');
          navigate('/employed');
        }
      } else {
        // Nếu không có thông tin roles, chuyển đến login
        console.log('AuthContext: No roles detected, redirecting to /employed');
        navigate('/employed');
      }
      
      return data;
    } catch (err) {
      console.error('AuthContext: Login failed:', err);
      // Xử lý thông báo lỗi từ API 
      const message = err.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
      console.log('AuthContext: Login process completed');
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 