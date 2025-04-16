import { useState, useEffect, useRef } from 'react';
import { useIdleTimerContext } from '../contexts/IdleTimerContext';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from '@mui/material';
import { useAuth } from '../hooks';

const IdleTimerWarning = () => {
  const { isIdle, timeRemaining, resetTimer } = useIdleTimerContext();
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const autoLogoutTimerRef = useRef(null);
  
  // Thời gian cảnh báo trước khi đăng xuất: 10000ms = 10 giây
  const warningThreshold = 10000;
  
  // Theo dõi thời gian còn lại
  useEffect(() => {
    // Nếu người dùng đang không hoạt động
    if (isIdle) {
      console.log('IdleTimerWarning: User is idle, time remaining:', timeRemaining);
      
      // Nếu thời gian còn lại ít hơn hoặc bằng ngưỡng cảnh báo và chưa hiển thị modal
      if (timeRemaining <= warningThreshold && !showModal) {
        console.log('IdleTimerWarning: Showing warning modal with', Math.floor(timeRemaining / 1000), 'seconds remaining');
        setShowModal(true);
      }
      
      // Nếu thời gian còn lại <= 0, tự động đăng xuất
      if (timeRemaining <= 0) {
        console.log('IdleTimerWarning: Time expired, logging out');
        logout();
        return;
      }
    }
  }, [isIdle, timeRemaining, logout, showModal]);
  
  // Thiết lập bộ hẹn giờ đăng xuất khi modal hiển thị
  useEffect(() => {
    if (showModal && isIdle) {
      // Xóa bộ hẹn giờ cũ nếu có
      if (autoLogoutTimerRef.current) {
        clearTimeout(autoLogoutTimerRef.current);
      }
      
      // Đặt hẹn giờ mới dựa trên thời gian còn lại (để đảm bảo đúng thời gian)
      console.log('IdleTimerWarning: Setting auto logout timer for', timeRemaining, 'ms');
      autoLogoutTimerRef.current = setTimeout(() => {
        console.log('IdleTimerWarning: Auto logout triggered by timer');
        logout();
      }, timeRemaining);
    }
    
    return () => {
      if (autoLogoutTimerRef.current) {
        clearTimeout(autoLogoutTimerRef.current);
        autoLogoutTimerRef.current = null;
      }
    };
  }, [showModal, isIdle, timeRemaining, logout]);

  // Format thời gian còn lại thành giây
  const formatTimeRemaining = () => {
    const seconds = Math.floor(timeRemaining / 1000);
    return `${seconds}`;
  };

  // Tính toán phần trăm thời gian còn lại
  const calculateProgress = () => {
    return (timeRemaining / warningThreshold) * 100;
  };

  // Tiếp tục phiên làm việc
  const handleContinue = () => {
    console.log('IdleTimerWarning: Continue session');
    
    // Đặt lại bộ đếm thời gian
    resetTimer();
    
    // Ẩn cảnh báo
    setShowModal(false);
    
    // Hủy hẹn giờ tự động đăng xuất
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
      autoLogoutTimerRef.current = null;
    }
  };

  // Đăng xuất ngay
  const handleLogout = () => {
    console.log('IdleTimerWarning: Immediate logout');
    logout();
  };

  return (
    <Dialog open={showModal} onClose={handleContinue}>
      <DialogTitle>Cảnh báo phiên làm việc sắp hết hạn</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn sẽ tự động đăng xuất sau {formatTimeRemaining()} giây do không hoạt động.
        </Typography>
        <Box sx={{ mt: 2, width: '100%' }}>
          <LinearProgress variant="determinate" value={calculateProgress()} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleContinue} variant="contained" color="primary">
          Tiếp tục phiên làm việc
        </Button>
        <Button onClick={handleLogout} variant="outlined" color="error">
          Đăng xuất ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdleTimerWarning; 