import axios from 'axios';

// Đảm bảo URL đúng với backend
const API_URL = 'http://localhost:8080/api';

// In thông tin debug
console.log('API Service: Initializing with base URL:', API_URL);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  // Đảm bảo CORS được xử lý đúng
  withCredentials: false
});

// Request interceptor - runs before each request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      // Sửa lại format của Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle token errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("toknpen");
      localStorage.removeItem("user");
      // Redirect to login page if needed
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

// Thêm phương thức kiểm tra kết nối
const checkConnection = async () => {
  console.log('Checking API connection...');
  
  try {
    // Thử kết nối đến API bằng cách gọi một endpoint đơn giản
    // Sử dụng OPTIONS request để kiểm tra CORS
    const response = await axios.options(API_URL);
    console.log('API Connection Check Response:', response);
    
    // Nếu kết nối thành công, trả về status 'ok'
    return { 
      status: 'ok', 
      message: 'Kết nối API thành công' 
    };
  } catch (error) {
    console.error('API Connection Check Failed:', error);
    
    // Kiểm tra xem có phải lỗi CORS không
    if (error.message && error.message.includes('CORS')) {
      return { 
        status: 'ok', 
        message: 'API server đang hoạt động (CORS được cấu hình)' 
      };
    }
    
    // Nếu lỗi là 404 hoặc 405, có thể là endpoint không tồn tại nhưng API vẫn hoạt động
    if (error.response && (error.response.status === 404 || error.response.status === 405)) {
      return { 
        status: 'ok', 
        message: 'API server đang hoạt động' 
      };
    }
    
    return { 
      status: 'error', 
      message: 'Không thể kết nối đến API server: ' + (error.message || 'Unknown error') 
    };
  }
};

// API utility functions
const api = {
  // Authentication
  login: async (credentials) => {
    console.log('API: Login called with credentials:', credentials);
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('API: Login response:', response.data);
      
      // Xử lý response dựa trên cấu trúc của API backend
      let data = response.data;
      
      // Kiểm tra cấu trúc response để xác định thành công hay thất bại
      if (data.success === false) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Chuẩn hóa dữ liệu user
      let token, userInfo;
      
      // Trường hợp 1: Response trả về {success, data: {token, userInfo}}
      if (data.success && data.data) {
        token = data.data.token;
        userInfo = data.data.userInfo;
      }
      // Trường hợp 2: Response trả về {token, user} trực tiếp
      else if (data.token) {
        token = data.token;
        userInfo = data.user || data.userInfo;
      }
      // Trường hợp 3: Response trả về dữ liệu trực tiếp (không có wrapper)
      else if (typeof data === 'object' && !data.success) {
        token = data.token;
        userInfo = data.user || data.userInfo;
      }
      
      // Nếu không có token hoặc user info, báo lỗi
      if (!token || !userInfo) {
        console.error('API: Invalid login response structure', data);
        throw new Error('Invalid response format from server');
      }
      
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Trả về dữ liệu chuẩn hóa
      return {
        token,
        user: userInfo
      };
    } catch (error) {
      console.error('API: Login failed:', error.response?.data || error.message);
      throw error;
    }
  },
  
  register: (userData) => axiosInstance.post('/auth/register', userData),
  
  logout: async () => {
    try {
      // Call logout API endpoint
      const token = localStorage.getItem('token');
      if (token) {
        await axiosInstance.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always remove local storage items even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  // User management
  getCurrentUser: () => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  },
  
  updateUserProfile: (data) => axiosInstance.put('/users/profile', data),
  
  // Authentication helpers
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUserRoles: () => {
    const user = api.getCurrentUser();
    return user?.roles || [];
  },

  hasRole: (role) => {
    const roles = api.getUserRoles();
    return roles.includes(role);
  },

  hasAnyRole: (roles) => {
    const userRoles = api.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  },

  hasAllRoles: (roles) => {
    const userRoles = api.getUserRoles();
    return roles.every(role => userRoles.includes(role));
  },

  isAdmin: () => {
    return api.hasRole('ROLE_ADMIN');
  },

  getRedirectPath: () => {
    console.log('getRedirectPath: Checking role for redirection');
    const user = api.getCurrentUser();
    console.log('Current user roles:', user?.roles);
    
    if (api.isAdmin()) {
      console.log('User is admin, redirecting to /admin');
      return '/admin';
    } else {
      console.log('User is not admin, redirecting to /employees');
      return '/employees';
    }
  },
  
  checkConnection,
  
  // Hotel room management
  getRooms: (params) => axiosInstance.get('/rooms', { params }),
  getRoomById: (id) => axiosInstance.get(`/rooms/${id}`),
  getRoomCategories: () => axiosInstance.get('/rooms/categories'),
  createRoom: (roomData) => axiosInstance.post('/rooms', roomData),
  updateRoom: (id, roomData) => axiosInstance.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => axiosInstance.delete(`/rooms/${id}`),
  
  // Bookings management
  getBookings: (params) => axiosInstance.get('/bookings', { params }),
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  updateBookingStatus: (id, status) => axiosInstance.patch(`/bookings/${id}/status`, { status }),
  
  // Employees management
  getEmployees: () => axiosInstance.get('/employees'),
  createEmployee: (employeeData) => axiosInstance.post('/employees', employeeData),
  updateEmployee: (id, employeeData) => axiosInstance.put(`/employees/${id}`, employeeData),
  deleteEmployee: (id) => axiosInstance.delete(`/employees/${id}`),
  
  // Activity Log management
  getActivityLogs: (params) => axiosInstance.get('/activity-logs', { params }),
  getActivityLogsByUserId: (userId, params) => axiosInstance.get(`/activity-logs/${userId}`, { params }),
};

export { axiosInstance, api as default, checkConnection }; 