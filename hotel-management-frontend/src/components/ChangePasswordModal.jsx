import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  InputAdornment,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { axiosInstance } from '../services/api';

// Cấu hình các thông báo lỗi
const ERROR_MESSAGES = {
  WRONG_PASSWORD: 'Mật khẩu hiện tại không đúng với tài khoản đang đăng nhập',
  EMPTY_OLD_PASSWORD: 'Vui lòng nhập mật khẩu hiện tại',
  EMPTY_NEW_PASSWORD: 'Vui lòng nhập mật khẩu mới',
  SHORT_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự',
  EMPTY_CONFIRM_PASSWORD: 'Vui lòng xác nhận mật khẩu mới',
  PASSWORDS_NOT_MATCH: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
  SAME_PASSWORD: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
  EXPIRED_SESSION: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  SERVER_ERROR: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ'
};

const ChangePasswordModal = ({ open, onClose }) => {
  const initialFormData = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      resetForm();
      // Focus vào trường đầu tiên khi modal mở
      setTimeout(() => {
        const oldPasswordInput = document.querySelector('input[name="oldPassword"]');
        if (oldPasswordInput) {
          oldPasswordInput.focus();
        }
      }, 100);
    }
  }, [open]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setApiError('');
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false
    });
  }, []);

  // Xử lý thay đổi input
  const handleChange = useCallback((e) => {
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
  }, [errors, apiError]);

  // Xử lý hiển thị/ẩn mật khẩu
  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Kiểm tra mật khẩu hiện tại
    if (!formData.oldPassword) {
      newErrors.oldPassword = ERROR_MESSAGES.EMPTY_OLD_PASSWORD;
    }
    
    // Kiểm tra mật khẩu mới
    if (!formData.newPassword) {
      newErrors.newPassword = ERROR_MESSAGES.EMPTY_NEW_PASSWORD;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = ERROR_MESSAGES.SHORT_PASSWORD;
    }
    
    // Kiểm tra xác nhận mật khẩu mới
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = ERROR_MESSAGES.EMPTY_CONFIRM_PASSWORD;
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
    }
    
    // Kiểm tra mật khẩu mới phải khác mật khẩu cũ
    if (formData.newPassword && formData.oldPassword && formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = ERROR_MESSAGES.SAME_PASSWORD;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Xử lý đóng modal
  const handleClose = useCallback(() => {
    resetForm();
    onClose(false);
  }, [resetForm, onClose]);

  // Xử lý message thành công
  const handleSuccessClose = useCallback(() => {
    setSuccessMessage('');
  }, []);

  // Xử lý các loại lỗi validation
  const handleValidationError = useCallback((error) => {
    // Kiểm tra nếu có OldPasswordMatch error từ server
    if (error && error.response && error.response.data) {
      const responseData = error.response.data;
      console.log('Response data:', responseData);
      
      // Trường hợp lỗi 400 - Bad Request
      if (error.response.status === 400) {
        // Kiểm tra cấu trúc lỗi cụ thể với errors object
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Xử lý cấu trúc: { message: '...', errors: { oldPassword: '...' } }
          const fieldErrors = {};
          
          // Xử lý các lỗi field cụ thể
          if (responseData.errors.oldPassword) {
            fieldErrors.oldPassword = responseData.errors.oldPassword;
          }
          if (responseData.errors.newPassword) {
            fieldErrors.newPassword = responseData.errors.newPassword;
          }
          if (responseData.errors.confirmNewPassword) {
            fieldErrors.confirmNewPassword = responseData.errors.confirmNewPassword;
          }
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...fieldErrors }));
            return; // Đã xử lý lỗi, thoát khỏi hàm
          }
        }
        
        // Xử lý các dạng response khác nhau từ server
        if (responseData.message) {
          // Trường hợp message đơn giản
          handleErrorMessage(responseData.message);
        } 
        else if (responseData.errors && Array.isArray(responseData.errors)) {
          // Trường hợp errors array từ MethodArgumentNotValidException
          const oldPasswordError = responseData.errors.find(err => 
            (err.field === 'oldPassword') || 
            (err.codes && Array.isArray(err.codes) && err.codes.some(code => code.includes('OldPasswordMatch')))
          );
          
          if (oldPasswordError) {
            // Sử dụng chính xác thông báo lỗi từ server
            setErrors(prev => ({
              ...prev,
              oldPassword: oldPasswordError.defaultMessage || ERROR_MESSAGES.WRONG_PASSWORD
            }));
          } else {
            // Xử lý các lỗi validation khác
            const fieldErrors = {};
            
            responseData.errors.forEach(err => {
              if (err.field === 'oldPassword') {
                fieldErrors.oldPassword = err.defaultMessage || ERROR_MESSAGES.WRONG_PASSWORD;
              }
              else if (err.field === 'newPassword') {
                fieldErrors.newPassword = err.defaultMessage || ERROR_MESSAGES.SHORT_PASSWORD;
              } 
              else if (err.field === 'confirmNewPassword') {
                fieldErrors.confirmNewPassword = err.defaultMessage || ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
              }
              // Xử lý lỗi object level validation
              else if (!err.field && err.defaultMessage) {
                handleErrorMessage(err.defaultMessage);
              }
              // Xử lý trường hợp đặc biệt cho OldPasswordMatch codes
              else if (err.codes && Array.isArray(err.codes) && err.codes.some(code => code.includes('OldPasswordMatch'))) {
                fieldErrors.oldPassword = err.defaultMessage || ERROR_MESSAGES.WRONG_PASSWORD;
              }
            });
            
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(prev => ({ ...prev, ...fieldErrors }));
            }
          }
        }
        else if (responseData.fieldErrors) {
          // Trường hợp fieldErrors từ BindingResult
          const fieldErrors = {};
          
          Object.entries(responseData.fieldErrors).forEach(([field, error]) => {
            fieldErrors[field] = Array.isArray(error) ? error[0] : error;
          });
          
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
        else if (responseData.oldPassword) {
          // Trường hợp đặc biệt chỉ có lỗi oldPassword
          setErrors(prev => ({
            ...prev,
            oldPassword: responseData.oldPassword || ERROR_MESSAGES.WRONG_PASSWORD
          }));
        }
        else {
          // Kiểm tra xem responseData có chứa thông báo lỗi dạng chuỗi không
          if (typeof responseData === 'string') {
            handleErrorMessage(responseData);
          } else {
            // Các trường hợp khác
            setApiError('Vui lòng kiểm tra lại thông tin đã nhập');
          }
        }
      }
      // Trường hợp lỗi 401 - Unauthorized
      else if (error.response.status === 401) {
        setApiError(ERROR_MESSAGES.EXPIRED_SESSION);
      }
      // Trường hợp lỗi 403 - Forbidden
      else if (error.response.status === 403) {
        setErrors(prev => ({ 
          ...prev, 
          oldPassword: ERROR_MESSAGES.WRONG_PASSWORD
        }));
      }
      // Các lỗi HTTP khác
      else {
        if (typeof responseData === 'string') {
          setApiError(responseData);
        } else {
          setApiError(responseData.message || ERROR_MESSAGES.SERVER_ERROR);
        }
      }
    } 
    // Lỗi không có response.data
    else if (error.message) {
      if (error.message.includes('Network Error')) {
        setApiError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setApiError(error.message);
      }
    } 
    // Lỗi không xác định
    else {
      setApiError(ERROR_MESSAGES.SERVER_ERROR);
    }
  }, []);

  // Xử lý thông báo lỗi
  const handleErrorMessage = useCallback((message) => {
    if (!message) return;
    
    const messageLower = message.toLowerCase();
    
    // Xử lý các loại thông báo lỗi phổ biến
    if (messageLower.includes('mật khẩu hiện tại không đúng') || 
        messageLower.includes('mật khẩu không hợp lệ') || 
        messageLower.includes('mật khẩu không chính xác') ||
        messageLower.includes('mật khẩu cũ không chính xác')) {
      // Sử dụng chính thông báo lỗi từ server thay vì thông báo tĩnh
      setErrors(prev => ({ ...prev, oldPassword: message }));
    }
    else if (messageLower.includes('mật khẩu mới đang trùng') || 
            messageLower.includes('trùng với mật khẩu hiện tại')) {
      setErrors(prev => ({ ...prev, newPassword: message }));
    }
    else if (messageLower.includes('mật khẩu mới và xác nhận')) {
      setErrors(prev => ({ ...prev, confirmNewPassword: message }));
    }
    else if (messageLower.includes('phiên đăng nhập')) {
      setApiError(message);
    }
    else {
      setApiError(message);
    }
  }, []);

  // Xử lý submit form
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    setErrors({});
    
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword
      });
      
      if (response.data && response.data.success) {
        // Hiển thị thông báo thành công và đóng modal sau 1.5s
        setSuccessMessage('Đổi mật khẩu thành công!');
        setTimeout(() => {
          onClose(true);
        }, 1500);
      } else {
        setApiError(response.data?.message || 'Đã có lỗi khi đổi mật khẩu');
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      handleValidationError(error);
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, formData, onClose, handleValidationError]);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '8px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            Đổi mật khẩu
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={isLoading}>
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
              type={showPasswords.oldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPasswords.oldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Mật khẩu mới"
              type={showPasswords.newPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword || "Mật khẩu phải có ít nhất 6 ký tự và khác với mật khẩu hiện tại"}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('newPassword')}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPasswords.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Xác nhận mật khẩu mới"
              type={showPasswords.confirmNewPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword || "Nhập lại chính xác mật khẩu mới"}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirmNewPassword')}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPasswords.confirmNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Lưu ý: Việc thay đổi mật khẩu sẽ yêu cầu đăng nhập lại với mật khẩu mới.
            </Typography>
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
              color: '#333',
              px: 3
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
              textTransform: 'none',
              px: 3
            }}
          >
            {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Thông báo thành công */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={handleSuccessClose}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default ChangePasswordModal;
