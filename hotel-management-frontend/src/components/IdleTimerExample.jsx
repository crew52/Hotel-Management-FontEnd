import { useState, useEffect } from 'react';
import { useIdleTimerContext } from '../contexts/IdleTimerContext';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from '@mui/material';

const IdleTimerExample = () => {
  const { isIdle, timeRemaining, lastActive, resetTimer } = useIdleTimerContext();
  const [showModal, setShowModal] = useState(false);

  // Format the time remaining in minutes and seconds
  const formatTimeRemaining = () => {
    const seconds = Math.floor(timeRemaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Calculate the percentage of time remaining
  const calculateProgress = () => {
    // Assuming the total timeout is 5 minutes (300000ms)
    const totalTimeout = 300000;
    return (timeRemaining / totalTimeout) * 100;
  };

  // Show the warning modal when user becomes idle
  useEffect(() => {
    if (isIdle) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isIdle]);

  // Handle continue session
  const handleContinue = () => {
    resetTimer();
    setShowModal(false);
  };

  // Format the last active time
  const formatLastActive = () => {
    return lastActive.toLocaleTimeString();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Idle Timer Demo
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography>
          Status: {isIdle ? 'Idle' : 'Active'}
        </Typography>
        <Typography>
          Time remaining: {formatTimeRemaining()}
        </Typography>
        <Typography>
          Last active: {formatLastActive()}
        </Typography>
        <Box sx={{ mt: 2, width: '100%' }}>
          <LinearProgress variant="determinate" value={calculateProgress()} />
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={resetTimer}
        >
          Reset Timer
        </Button>
      </Box>

      {/* Idle Warning Modal */}
      <Dialog open={showModal} onClose={handleContinue}>
        <DialogTitle>Session Timeout Warning</DialogTitle>
        <DialogContent>
          <Typography>
            Your session is about to expire due to inactivity.
          </Typography>
          <Box sx={{ mt: 2, width: '100%' }}>
            <LinearProgress variant="determinate" value={calculateProgress()} />
          </Box>
          <Typography sx={{ mt: 1, textAlign: 'center' }}>
            {formatTimeRemaining()} remaining
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContinue} variant="contained" color="primary">
            Continue Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IdleTimerExample; 