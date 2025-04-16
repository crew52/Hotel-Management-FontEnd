import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Typography, Container, Box, Paper } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <StyledHomePage>
      <Container maxWidth="md">
        <Paper elevation={3} className="content-box">
          <Typography variant="h3" component="h1" gutterBottom>
            Hotel Management System
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Welcome to the Hotel Management System. Please log in to continue.
          </Typography>
          
          <Box mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </StyledHomePage>
  );
};

const StyledHomePage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: url(https://images7.alphacoders.com/458/458532.jpg) no-repeat center center fixed;
  background-size: cover;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  .content-box {
    padding: 2rem;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

export default HomePage; 