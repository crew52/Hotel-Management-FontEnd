import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, useColorScheme } from '@mui/material/styles';
import AppTheme from '../../theme/Login/AppTheme';
import ColorModeSelect from '../../theme/Login/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../../components/Login/CustomIcons';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderColor: 'rgba(0, 0, 0, 0.12)',
}));

const SignInContainer = styled(Stack)(({ theme }) => {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  
  return {
    height: '100vh',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      backgroundImage: isDark
        ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
        : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
      backgroundRepeat: 'no-repeat',
    },
  };
});

export default function SignIn(props) {
  const { mode } = useColorScheme();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    const loginData = {
      email,
      password,
      rememberMe
    };
    
    console.log('Login attempt with:', loginData);
    
    // TODO: Implement actual login API call
    // Example:
    // axios.post('/api/auth/login', loginData)
    //   .then(response => {
    //     localStorage.setItem('authToken', response.data.token);
    //     window.location.href = '/dashboard';
    //   })
    //   .catch(error => {
    //     console.error('Login failed:', error);
    //   });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined" sx={{ bgcolor: mode === 'dark' ? '#1a1a2e' : 'white', color: mode === 'dark' ? 'white' : 'inherit' }}>
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined }}>Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                InputProps={{
                  sx: { 
                    color: mode === 'dark' ? 'white' : undefined,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : undefined
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : undefined
                    }
                  }
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined }}>Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                InputProps={{
                  sx: { 
                    color: mode === 'dark' ? 'white' : undefined,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : undefined
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : undefined
                    }
                  }
                }}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined }}
                />
              }
              label="Remember me"
              sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
            <Link
              href="/forgot-password"
              variant="body2"
              sx={{ 
                alignSelf: 'center',
                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined 
              }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider sx={{ 
            '&::before, &::after': { 
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : undefined 
            },
            color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined
          }}>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ 
                justifyContent: 'center',
                color: mode === 'dark' ? 'white' : undefined,
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.23)' : undefined,
                '&:hover': {
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.5)' : undefined
                }
              }}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{ 
                justifyContent: 'center',
                color: mode === 'dark' ? 'white' : undefined,
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.23)' : undefined,
                '&:hover': {
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.5)' : undefined
                }
              }}
            >
              Sign in with Facebook
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined
            }}
          >
            <span>Don't have an account?</span>
            <Link 
              href="/register" 
              variant="body2"
              sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.9)' : undefined }}
            >
              Sign up
            </Link>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
} 