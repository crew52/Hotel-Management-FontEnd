import { useIdleTimerContext } from '../contexts/IdleTimerContext';
import { Box, Typography, Paper } from '@mui/material';

const IdleTimerDebug = () => {
  const { isIdle, timeRemaining, lastActive } = useIdleTimerContext();

  const formatTimeRemaining = () => {
    const seconds = Math.floor(timeRemaining / 1000);
    return `${seconds}s`;
  };

  const formatLastActive = () => {
    return lastActive.toLocaleTimeString();
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        padding: 2,
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 220
      }}
    >
      <Typography variant="h6" gutterBottom>
        IdleTimer Debug
      </Typography>
      <Box>
        <Typography>
          <strong>Trạng thái:</strong> {isIdle ? 'Không hoạt động' : 'Đang hoạt động'}
        </Typography>
        <Typography>
          <strong>Thời gian còn lại:</strong> {formatTimeRemaining()}
        </Typography>
        <Typography>
          <strong>Hoạt động cuối:</strong> {formatLastActive()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default IdleTimerDebug; 