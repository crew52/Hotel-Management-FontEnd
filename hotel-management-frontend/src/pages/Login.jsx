import React from 'react';
import styled from 'styled-components';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <StyledLoginPage>
      <LoginForm />
    </StyledLoginPage>
  );
};

const StyledLoginPage = styled.div`
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
  
  @media (max-width: 480px) {
    padding: 10px;
    background: url(https://images7.alphacoders.com/458/458532.jpg) no-repeat center center fixed;
    background-size: cover;
  }
`;

export default Login; 