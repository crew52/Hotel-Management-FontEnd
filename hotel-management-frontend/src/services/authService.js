import api from './api';

const AUTH_ENDPOINT = '/auth';

const authService = {
  /**
   * Check API connection
   * @returns {Promise} - Promise with connection status
   */
  checkConnection: async () => {
    try {
      // Thử kết nối với API bằng cách gọi OPTIONS đến endpoint login
      await api.options(`${AUTH_ENDPOINT}/login`);
      console.log('API connection successful');
      return { status: 'ok', message: 'Kết nối API thành công' };
    } catch (error) {
      console.error('API connection failed:', error);
      return { 
        status: 'error', 
        message: 'Không thể kết nối đến API. Vui lòng kiểm tra server backend.' 
      };
    }
  },

  /**
   * Login user with username/email and password
   * @param {string} usernameOrEmail - User username or email
   * @param {string} password - User password
   * @returns {Promise} - Promise with user data and token
   */
  login: async (usernameOrEmail, password) => {
    console.log('AuthService: Login called with:', { usernameOrEmail });
    try {
      console.log('Making API request to:', `${AUTH_ENDPOINT}/login`);
      const response = await api.post(`${AUTH_ENDPOINT}/login`, { usernameOrEmail, password });
      console.log('API response received:', response.data);
      
      // Phân tích dữ liệu từ ApiResponse của backend
      const { success, message, data } = response.data;
      
      if (success) {
        // Check if response contains token directly or in data
        const token = response.data.token || (data && data.accessToken) || '';
        
        // If we have a token, store it
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token stored in localStorage');
        }
        
        // For user details, check both response and data property
        const userInfo = response.data.user || data || {};
        
        // Create a default user object with minimal info if no detailed user info available
        const user = {
          id: userInfo.id || 'unknown',
          username: usernameOrEmail,
          roles: userInfo.roles || [{ name: 'ROLE_USER' }],
          ...userInfo
        };
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User info stored in localStorage:', user);
        
        // Return data for AuthContext
        return {
          token: token,
          user: user
        };
      } else {
        // Nếu đăng nhập thất bại, ném lỗi với thông báo từ server
        throw new Error(message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('API request failed:', error.response?.data || error.message);
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
  }
};

export default authService; 