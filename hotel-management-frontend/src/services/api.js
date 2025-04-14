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
      config.headers.Authorization = token;
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

export default api; 