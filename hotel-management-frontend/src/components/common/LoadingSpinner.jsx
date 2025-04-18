import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ size = 40, color = 'primary', thickness = 4 }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      minHeight="200px"
    >
      <CircularProgress 
        size={size} 
        color={color} 
        thickness={thickness} 
      />
    </Box>
  );
};

export default LoadingSpinner; 