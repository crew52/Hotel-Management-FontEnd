import axios from 'axios';

// Địa chỉ backend API
const API_URL = 'http://localhost:8080';
const API_PREFIX = '/api';

console.log('API Service: Khởi tạo với URL:', API_URL + API_PREFIX);

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 giây timeout
  withCredentials: false // Tắt credentials để tránh vấn đề CORS
});

// Request interceptor - chạy trước mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - chạy sau mỗi response
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
    
    // Xử lý lỗi token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Chuyển hướng đến trang đăng nhập
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

// Kiểm tra kết nối API
const checkConnection = async () => {
  console.log('Đang kiểm tra kết nối API...');
  
  try {
    // Sử dụng axios trực tiếp thay vì axiosInstance để tránh baseURL
    const response = await axios.get(`${API_URL}/api/auth/check`, { timeout: 5000 });
    console.log('Kết nối API thành công:', response);
    return { 
      status: 'ok',
      message: 'Kết nối API thành công'
    };
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    
    // Nếu lỗi là 404, có thể API vẫn hoạt động nhưng endpoint không tồn tại
    if (error.response && (error.response.status === 404 || error.response.status === 405)) {
      return { 
        status: 'ok',
        message: 'API server đang hoạt động'
      };
    }
    
    return { 
      status: 'error',
      message: 'Không thể kết nối đến API server: ' + (error.message || 'Lỗi không xác định')
    };
  }
};

// Các hàm API
const api = {
  // Authentication
  login: async (credentials) => {
    console.log('API: Đăng nhập với thông tin:', credentials);
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('API: Kết quả đăng nhập:', response.data);
      
      let data = response.data;
      let token, userInfo;
      
      // Xử lý các trường hợp response khác nhau
      if (data.token) {
        // Trường hợp phổ biến: response trả về {token, user}
        token = data.token;
        userInfo = data.user || data.userInfo;
      } 
      else if (typeof data === 'string') {
        // Trường hợp JWT token trả về trực tiếp dưới dạng string
        token = data;
        try {
          // Lưu token để có thể gọi API lấy thông tin user
          localStorage.setItem('token', token);
          const userResponse = await axiosInstance.get('/auth/me');
          userInfo = userResponse.data;
        } catch (userError) {
          console.error('Không thể lấy thông tin người dùng sau khi đăng nhập:', userError);
          throw new Error('Xác thực thành công nhưng không lấy được thông tin người dùng');
        }
      }
      else if (data.success && data.data) {
        // Trường hợp response có dạng {success, data: {token, userInfo}}
        token = data.data.token;
        userInfo = data.data.userInfo;
      }
      else if (typeof data === 'object') {
        // Trường hợp khác: response trả về object không có success
        token = data.token;
        userInfo = data.user || data.userInfo;
      }
      
      // Kiểm tra dữ liệu hợp lệ
      if (!token || !userInfo) {
        console.error('API: Cấu trúc response không hợp lệ', data);
        throw new Error('Định dạng response không hợp lệ');
      }
      
      // Lưu token và thông tin user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return {
        token,
        user: userInfo
      };
    } catch (error) {
      console.error('API: Đăng nhập thất bại:', error.response?.data || error.message);
      throw error;
    }
  },
  
  register: (userData) => axiosInstance.post('/auth/register', userData),
  
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axiosInstance.post('/auth/logout');
          console.log('Đăng xuất thành công');
        } catch (apiError) {
          console.error('API đăng xuất thất bại:', apiError);
        }
      }
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = "/login";
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
    console.log('Kiểm tra vai trò người dùng để chuyển hướng');
    const user = api.getCurrentUser();
    console.log('Vai trò người dùng:', user?.roles);
    
    if (api.isAdmin()) {
      console.log('Người dùng là admin, chuyển hướng đến /admin');
      return '/admin';
    } else {
      console.log('Người dùng không phải admin, chuyển hướng đến /employees');
      return '/employees';
    }
  },
  
  checkConnection,
  
  // Hotel room management
  getRooms: (params) => {
    console.log("API: Getting rooms with params:", params);
    return axiosInstance.get('/rooms', { params })
      .then(response => {
        console.log("API: Get rooms response:", response.data);
        return response.data;
      });
  },
  getRoomById: (id) => {
    console.log(`API: Getting room with ID: ${id}`);
    return axiosInstance.get(`/rooms/${id}`)
      .then(response => {
        console.log("API: Get room by ID response:", response.data);
        return response.data;
      });
  },
  getRoomCategories: () => {
    console.log("API: Getting room categories");
    return axiosInstance.get('/room-categories')
      .then(response => {
        console.log("API: Get room categories response:", response.data);
        return response.data;
      });
  },
  getRoomCategoriesById: (id) => {
    console.log(`API: Getting room category with ID: ${id}`);
    return axiosInstance.get(`/room-categories/${id}`)
      .then(response => {
        console.log("API: Get room category by ID response:", response.data);
        return response.data;
      });
  },
  createRoom: (roomData) => {
    console.log("API: Creating room:", roomData);
    return axiosInstance.post('/rooms', roomData)
      .then(response => {
        console.log("API: Create room response:", response.data);
        return response.data;
      });
  },
  updateRoom: (id, roomData) => {
    console.log(`API: Updating room ${id}:`, roomData);
    return axiosInstance.put(`/rooms/${id}`, roomData)
      .then(response => {
        console.log("API: Update room response:", response.data);
        return response.data;
      });
  },
  deleteRoom: (id) => {
    console.log(`API: Deleting room ${id}`);
    return axiosInstance.delete(`/rooms/${id}/delete`)
      .then(response => {
        console.log("API: Delete room response:", response.data);
        return response.data;
      });
  },
  
  // Room categories
  addRoomCategory: (data) => {
    console.log("API: Creating room category:", data);
    return axiosInstance.post('/room-categories', data)
      .then(response => {
        console.log("API: Create room category response:", response.data);
        return response.data;
      });
  },
  updateRoomCategory: (id, data) => {
    console.log(`API: Updating room category ${id}:`, data);
    return axiosInstance.put(`/room-categories/${id}/edit`, data)
      .then(response => {
        console.log("API: Update room category response:", response.data);
        return response.data;
      });
  },
  deleteRoomCategory: (id) => {
    console.log(`API: Deleting room category ${id}`);
    return axiosInstance.delete(`/room-categories/${id}/delete`)
      .then(response => {
        console.log("API: Delete room category response:", response.data);
        return response.data;
      });
  },
  searchRoomCategories: (params) => {
    console.log("API: Searching room categories with params:", params);
    return axiosInstance.get('/room-categories/search', { params })
      .then(response => {
        console.log("API: Search room categories response:", response.data);
        return response.data;
      });
  },
  getAllRoomCategories: () => {
    console.log("API: Getting all room categories");
    return axiosInstance.get('/room-categories')
      .then(response => {
        console.log("API: Get all room categories response:", response.data);
        return response.data;
      });
  },
  
  // Employee management
  getEmployees: (page = 0, size = 10) => {
    console.log(`API: Getting employees page=${page}, size=${size}`);
    return axiosInstance.get(`/employees?page=${page}&size=${size}`)
      .then(response => {
        console.log("API: Get employees response:", response.data);
        return response.data;
      });
  },
  getEmployeeById: (id) => {
    console.log(`API: Getting employee with ID: ${id}`);
    return axiosInstance.get(`/employees/${id}`)
      .then(response => {
        console.log("API: Get employee by ID response:", response.data);
        return response.data;
      });
  },
  createEmployee: (data) => {
    console.log("API: Creating employee:", data);
    return axiosInstance.post('/employees', data)
      .then(response => {
        console.log("API: Create employee response:", response.data);
        return response.data;
      });
  },
  updateEmployee: (id, data) => {
    console.log(`API: Updating employee ${id}:`, data);
    return axiosInstance.put(`/employees/${id}`, data)
      .then(response => {
        console.log("API: Update employee response:", response.data);
        return response.data;
      });
  },
  deleteEmployee: (id) => {
    console.log(`API: Deleting employee ${id}`);
    return axiosInstance.delete(`/employees/${id}`)
      .then(response => {
        console.log("API: Delete employee response:", response.data);
        return response.data;
      });
  },
  searchEmployees: (search) => {
    console.log(`API: Searching employees with keyword: ${search}`);
    return axiosInstance.get(`/employees?full_name_like=${search}`)
      .then(response => {
        console.log("API: Search employees response:", response.data);
        return response.data;
      });
  },
  
  // Room view for employees
  getAllRoomView: () => {
    console.log("API: Getting all rooms view for employee");
    return axiosInstance.get('/rooms')
      .then(response => {
        console.log("API: Get all rooms view response:", response.data);
        return response.data;
      });
  },
  searchRoomView: ({ keyword = "", status = "", floor = "" }) => {
    console.log(`API: Searching rooms with keyword="${keyword}", status="${status}", floor="${floor}"`);
    const query = `/rooms/search?keyword=${keyword}&status=${status}&floor=${floor}`;
    return axiosInstance.get(query)
      .then(response => {
        console.log("API: Search rooms view response:", response.data);
        return response.data;
      });
  },
  
  // Bookings management
  getBookings: (params) => axiosInstance.get('/bookings', { params }),
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  updateBookingStatus: (id, status) => axiosInstance.patch(`/bookings/${id}/status`, { status }),
  
  // Activity Log management
  getActivityLogs: (params) => axiosInstance.get('/activity-logs', { params }),
  getActivityLogsByUserId: (userId, params) => axiosInstance.get(`/activity-logs/${userId}`, { params }),
};

export { axiosInstance, api as default, checkConnection, API_URL }; 