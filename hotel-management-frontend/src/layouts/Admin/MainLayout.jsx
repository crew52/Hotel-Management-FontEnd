import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const MainLayout = () => {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout; 