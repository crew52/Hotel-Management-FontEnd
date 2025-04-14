import axios from 'axios';

// Đảm bảo URL đúng với backend
const BASE_URL = 'http://localhost:8080/api';

// In thông tin debug
console.log('API Service: Initializing with base URL:', BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Đảm bảo CORS được xử lý đúng
  withCredentials: false
});

// Request interceptor - runs before each request
api.interceptors.request.use(
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
api.interceptors.response.use(
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
    
    // Handle token refresh here if needed
    if (error.response?.status === 401 && !error.config._retry) {
      // Implement token refresh logic if needed
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
    const response = await axios.options(BASE_URL);
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

export { api as default, checkConnection }; 