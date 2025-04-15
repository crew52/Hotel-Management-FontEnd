import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { axiosInstance } from '../services/api';

const ChangePasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setErrors({});
      setApiError('');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
    }
    
    // Kiểm tra xem mật khẩu mới có trùng với mật khẩu cũ không
    if (formData.newPassword && formData.oldPassword && formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = 'Mật khẩu mới đang trùng với mật khẩu cũ.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    setErrors({});
    
    try {
      const requestData = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword
      };
      
      const response = await axiosInstance.post('/auth/change-password', requestData);
      
      if (response.data && response.data.success) {
        onClose(true); // Đóng modal và báo thành công
      } else {
        setApiError(response.data.message || 'Đã có lỗi khi đổi mật khẩu');
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      
      // Log chi tiết để debug
      if (error.response) {
        console.log('Chi tiết phản hồi lỗi:', error.response);
      }
      
      // Xử lý lỗi từ server
      if (error.response && error.response.data) {
        // Kiểm tra nếu là lỗi validation từ Spring
        if (error.response.status === 400) {
          // Nếu là JSON với message
          if (error.response.data.message) {
            const message = error.response.data.message;
            handleErrorMessage(message);
          }
          // Nếu là JSON với errors từ MethodArgumentNotValidException
          else if (error.response.data.errors) {
            handleValidationErrors(error.response.data.errors);
          }
          // Nếu là JSON từ BindingResult
          else if (error.response.data.fieldErrors) {
            handleBindingErrors(error.response.data.fieldErrors);
          }
          // Xử lý trường hợp đặc biệt cho OldPasswordMatchValidator
          else if (error.response.data.oldPassword) {
            setErrors(prev => ({
              ...prev,
              oldPassword: error.response.data.oldPassword || 'Mật khẩu hiện tại không đúng'
            }));
          }
          else {
            setApiError('Vui lòng kiểm tra lại thông tin đã nhập');
          }
        } else {
          setApiError(error.response.data.message || 'Đã có lỗi xảy ra');
        }
      } else if (error.message) {
        if (error.message.includes('Network Error')) {
          setApiError('Không thể kết nối đến máy chủ');
        } else {
          setApiError(error.message);
        }
      } else {
        setApiError('Đã có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Hàm xử lý thông báo lỗi
  const handleErrorMessage = (message) => {
    if (!message) return;
    
    // Xử lý các loại thông báo lỗi phổ biến
    if (message.includes('Mật khẩu hiện tại không đúng')) {
      setErrors(prev => ({ ...prev, oldPassword: 'Mật khẩu hiện tại không đúng' }));
    } 
    else if (message.includes('Mật khẩu cũ không chính xác')) {
      setErrors(prev => ({ ...prev, oldPassword: 'Mật khẩu cũ không chính xác' }));
    }
    else if (message.includes('Mật khẩu mới đang trùng với mật khẩu cũ')) {
      setErrors(prev => ({ ...prev, newPassword: 'Mật khẩu mới đang trùng với mật khẩu cũ' }));
    }
    else if (message.includes('Mật khẩu mới và xác nhận mật khẩu không khớp')) {
      setErrors(prev => ({ ...prev, confirmNewPassword: 'Mật khẩu mới và xác nhận mật khẩu không khớp' }));
    }
    else {
      setApiError(message);
    }
  };
  
  // Xử lý lỗi validation từ Spring Boot
  const handleValidationErrors = (errors) => {
    if (!errors || !Array.isArray(errors)) return;
    
    const fieldErrors = {};
    
    errors.forEach(err => {
      if (err.field === 'oldPassword') {
        fieldErrors.oldPassword = err.defaultMessage || 'Mật khẩu hiện tại không hợp lệ';
      } 
      else if (err.field === 'newPassword') {
        fieldErrors.newPassword = err.defaultMessage || 'Mật khẩu mới không hợp lệ';
      } 
      else if (err.field === 'confirmNewPassword') {
        fieldErrors.confirmNewPassword = err.defaultMessage || 'Xác nhận mật khẩu không hợp lệ';
      }
      // Xử lý lỗi ở cấp độ class/object (không có field cụ thể)
      else if (!err.field && err.defaultMessage) {
        handleErrorMessage(err.defaultMessage);
      }
    });
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };
  
  // Xử lý lỗi binding từ Spring
  const handleBindingErrors = (fieldErrors) => {
    if (!fieldErrors) return;
    
    const errors = {};
    
    Object.keys(fieldErrors).forEach(field => {
      const error = fieldErrors[field];
      if (field === 'oldPassword') {
        errors.oldPassword = error;
      } 
      else if (field === 'newPassword') {
        errors.newPassword = error;
      } 
      else if (field === 'confirmNewPassword') {
        errors.confirmNewPassword = error;
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setErrors(prev => ({ ...prev, ...errors }));
    }
  };

  const handleClose = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setErrors({});
    setApiError('');
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Đổi mật khẩu
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu hiện tại"
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword}
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu mới"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Xác nhận mật khẩu mới"
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword}
            disabled={isLoading}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          variant="outlined" 
          onClick={handleClose}
          disabled={isLoading}
          sx={{ 
            borderRadius: '4px', 
            textTransform: 'none',
            borderColor: '#ccc',
            color: '#333'
          }}
        >
          Huỷ
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            borderRadius: '4px', 
            textTransform: 'none'
          }}
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal; 