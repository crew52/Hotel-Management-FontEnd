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
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
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
    background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  }
`;

export default Login; 