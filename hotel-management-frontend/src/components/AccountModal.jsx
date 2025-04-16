import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Box, 
  TextField, 
  Typography, 
  Button, 
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChangePasswordModal from './ChangePasswordModal';

const AccountModal = ({ open, onClose, userData = {} }) => {
  // Thông tin người dùng mặc định
  const defaultUserData = {
    username: userData.username || 'hoangphu',

    email: userData.email || '',
    
    role: userData.role || 'Admin',
 
    note: userData.note || ''
  };

  // Sử dụng state để quản lý form data
  const [formData, setFormData] = useState(defaultUserData);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    console.log('Lưu thông tin tài khoản:', formData);
    onClose();
  };

  const handleOpenChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = (success) => {
    setChangePasswordOpen(false);
    if (success) {
      setSnackbar({
        open: true,
        message: 'Đổi mật khẩu thành công!',
        severity: 'success'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        PaperProps={{
          sx: { 
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px' 
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Tài khoản
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Cột trái và cột phải */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Cột trái */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: '500' }}>
                    Tên tài khoản
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.username}
                    variant="outlined"
                    disabled
                  />
                </Box>

               

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: '500' }}>
                    Vai trò
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.role}
                    variant="outlined"
                    disabled
                  />
                </Box>
              </Box>

              {/* Cột phải */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: '500' }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Box>

               

          
              </Box>
            </Box>

            {/* Ghi chú */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: '500' }}>
                Ghi chú
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="note"
                value={formData.note}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Phần đăng nhập và bảo mật */}
            <Box sx={{ mt: 2, borderBottom: '1px dashed #ccc', borderTop: '1px dashed #ccc', py: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Đăng nhập và bảo mật
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #eee' 
                  }}>
                    🔒
                  </Box>
                  <Typography>
                    Đổi mật khẩu
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onClick={handleOpenChangePassword}
                  sx={{ 
                    borderRadius: '20px', 
                    textTransform: 'none',
                    borderColor: '#ccc',
                    color: '#333'
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Box>
            </Box>

            {/* Nút lưu hoặc bỏ qua */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{ 
                  borderRadius: '4px', 
                  textTransform: 'none',
                  borderColor: '#ccc',
                  color: '#333',
                  px: 3
                }}
              >
                Bỏ qua
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleSave}
                sx={{ 
                  borderRadius: '4px', 
                  textTransform: 'none',
                  px: 3,
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#388e3c'
                  }
                }}
              >
                Lưu
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal 
        open={changePasswordOpen} 
        onClose={handleCloseChangePassword} 
      />

      {/* Snackbar thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AccountModal; 