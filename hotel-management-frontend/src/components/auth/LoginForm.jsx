import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks';
import { Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [apiStatus, setApiStatus] = useState({ checking: true, ok: false, message: '' });
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  // Nếu người dùng đã đăng nhập, chuyển hướng họ
  useEffect(() => {
    if (user) {
      console.log("LoginForm: User already logged in:", user);
      console.log("LoginForm: User roles:", user.roles);
      
      // Đảm bảo chuyển hướng đúng dựa trên vai trò người dùng
      let redirectTo = '/employees'; // Đường dẫn mặc định
      
      if (user.roles && Array.isArray(user.roles)) {
        if (user.roles.includes('ROLE_ADMIN')) {
          redirectTo = '/admin';
          console.log("LoginForm: User is admin, redirecting to /admin");
        } else {
          console.log("LoginForm: User is not admin, redirecting to /employees");
        }
      } else {
        console.log("LoginForm: No roles found or roles not an array, using default redirect");
      }
      
      console.log(`LoginForm: Redirecting to ${redirectTo}`);
      navigate(redirectTo);
    }
  }, [user, navigate]);

  // Kiểm tra kết nối API khi component được tải
  useEffect(() => {
    const checkApiConnection = async () => {
      console.log('Starting API connection check...');
      try {
        const result = await api.checkConnection();
        console.log('API Connection Check Result:', result);
        
        // Luôn coi kết nối là thành công nếu có response từ server
        // Ngay cả khi response là lỗi, điều đó cũng có nghĩa là server đang hoạt động
        setApiStatus({
          checking: false,
          ok: true, // Luôn đặt là true nếu có response
          message: 'API server đang hoạt động'
        });
      } catch (error) {
        console.error('API Connection Check Error:', error);
        setApiStatus({
          checking: false,
          ok: false,
          message: 'Không thể kết nối đến API server: ' + (error.message || 'Unknown error')
        });
      }
    };

    checkApiConnection();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('LoginForm: Form submitted with data:', formData);
    setFormError('');

    // Basic validation
    if (!formData.usernameOrEmail || !formData.password) {
      setFormError('Vui lòng nhập cả tên đăng nhập/email và mật khẩu');
      return;
    }

    try {
      console.log('LoginForm: Attempting to login with:', formData.usernameOrEmail);
      const userData = await login(formData.usernameOrEmail, formData.password);
      console.log('LoginForm: Login successful, user data:', userData);
      // Chuyển hướng sẽ được xử lý trong useEffect khi user thay đổi
    } catch (err) {
      console.error('LoginForm: Login failed:', err);
      // Xử lý lỗi chi tiết hơn
      if (err.response) {
        setFormError(err.response.data?.message || 'Lỗi server: ' + err.response.status);
      } else if (err.message) {
        setFormError(err.message);
      } else {
        setFormError('Đăng nhập thất bại, vui lòng thử lại');
      }
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Đăng Nhập</div>
        
        {/* API Status Alert */}
        {apiStatus.checking ? (
          <Alert severity="info" className="error-alert">
            Đang kiểm tra kết nối đến máy chủ...
          </Alert>
        ) : !apiStatus.ok ? (
          <Alert severity="error" className="error-alert">
            {apiStatus.message}
          </Alert>
        ) : null}
        
        {/* Form Error Alert */}
        {(error || formError) && !apiStatus.checking && apiStatus.ok && (
          <Alert severity="error" className="error-alert">
            {formError || error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            className="input"
            type="text"
            name="usernameOrEmail"
            id="usernameOrEmail"
            placeholder="Tên đăng nhập hoặc Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <span className="forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </span>
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Đăng Nhập'}
          </button>
        </form>
        <div className="social-account-container">
          <span className="title">Or Sign in with</span>
          <div className="social-accounts">
            <button className="social-button google">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </button>
            <button className="social-button apple">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
            </button>
            <button className="social-button twitter">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </button>
          </div>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    max-width: 400px;
    width: 90%;
    /* background: rgba(255, 255, 255, 0.95); */
    background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
    border-radius: 20px;
    padding: 30px 40px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .heading {
    text-align: center;
    font-weight: 700;
    font-size: 32px;
    color: #2196f3;
    margin-bottom: 30px;
    letter-spacing: -0.5px;
  }

  .error-alert {
    margin-bottom: 15px;
  }

  .form {
    margin-top: 25px;
  }

  .form .input {
    width: 100%;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    padding: 15px 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    font-size: 15px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    color: #333;

    &:focus {
      outline: none;
      border-color: #2196f3;
      background: white;
      box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
      color: #000;
    }

    &::placeholder {
      color: #adb5bd;
      opacity: 0.8;
    }
  }

  .form .forgot-password {
    display: block;
    text-align: right;
    margin: -8px 0 20px;

    a {
      font-size: 13px;
      color: #2196f3;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .form .login-button {
    width: 100%;
    padding: 16px;
    font-weight: 600;
    font-size: 16px;
    background: linear-gradient(to right, #2196f3, #1976d2);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(to right, #1976d2, #1565c0);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }

  .social-account-container {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
  }

  .social-account-container .title {
    display: block;
    text-align: center;
    font-size: 13px;
    color: #6c757d;
    margin-bottom: 15px;
    position: relative;
  }

  .social-accounts {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
  }

  .social-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    padding: 0;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }

    .svg {
      width: 20px;
      height: 20px;
      fill: #495057;
    }
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 25px;

    a {
      font-size: 12px;
      color: #6c757d;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        color: #2196f3;
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 480px) {
    .container {
      width: 100%;
      padding: 20px;
      margin: 0;
      border-radius: 0;
      box-shadow: none;
      min-height: 100vh;
    }

    .heading {
      font-size: 28px;
    }

    .form .input {
      padding: 12px 15px;
      font-size: 14px;
    }

    .form .login-button {
      padding: 14px;
      font-size: 15px;
    }

    .social-button {
      width: 35px;
      height: 35px;
    }
  }
`;

export default LoginForm; 