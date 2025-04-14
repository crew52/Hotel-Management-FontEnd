import api, { checkConnection } from './api';

const AUTH_ENDPOINT = '/auth';

// Simple authentication service without complex role logic
const authService = {
  /**
   * Login user with username/email and password
   * @param {string} usernameOrEmail - User username or email
   * @param {string} password - User password
   * @returns {Promise} - Promise with user data
   */
  login: async (usernameOrEmail, password) => {
    try {
      const response = await api.post(`${AUTH_ENDPOINT}/login`, { usernameOrEmail, password });
      const { success, message, data } = response.data;
      
      if (success) {
        // Store token and user info from the response
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.userInfo));
        
        return {
          token: data.token,
          user: data.userInfo
        };
      } else {
        throw new Error(message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  },
  
  /**
   * Logout current user by removing stored data
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Get current user information from localStorage
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser: () => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Thêm các phương thức mới để xử lý role
  getUserRoles: () => {
    const user = authService.getCurrentUser();
    return user?.roles || [];
  },

  hasRole: (role) => {
    const roles = authService.getUserRoles();
    return roles.includes(role);
  },

  hasAnyRole: (roles) => {
    const userRoles = authService.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  },

  hasAllRoles: (roles) => {
    const userRoles = authService.getUserRoles();
    return roles.every(role => userRoles.includes(role));
  },

  isAdmin: () => {
    return authService.hasRole('ROLE_ADMIN');
  },

  isUser: () => {
    return authService.hasRole('ROLE_USER');
  },
  
  // Thêm phương thức mới để xác định trang chuyển hướng dựa trên role
  getRedirectPath: () => {
    if (authService.isAdmin()) {
      return '/admin';
    } else {
      return '/employees';
    }
  },
  
  // Thêm phương thức kiểm tra kết nối
  checkConnection: async () => {
    return await checkConnection();
  }
};

export default authService; 