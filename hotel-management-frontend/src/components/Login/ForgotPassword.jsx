import * as React from 'react';
import { styled, useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/Login/AppTheme';
import ColorModeSelect from '../../theme/Login/ColorModeSelect';

const FormBox = styled(Box)(({ theme }) => ({
  minWidth: '420px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
  },
}));

const ForgotPasswordContainer = styled(Stack)(({ theme }) => {
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

export default function ForgotPassword() {
  const { mode } = useColorScheme();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    console.log('Forgot password requested for:', email);
    // Redirect or API call for password reset
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ForgotPasswordContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <FormBox
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 1,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: mode === 'dark' ? '#1a1a2e' : 'white',
            color: mode === 'dark' ? 'white' : 'inherit',
            p: 4,
            borderRadius: 1,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <IconButton
            sx={{
              color: mode === 'dark' ? '#90caf9' : 'primary.main',
              alignSelf: 'flex-start',
              mb: 2,
            }}
            component={Link}
            href="/SignIn"
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color={mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
            sx={{ mb: 4, maxWidth: '85%' }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? 'Please enter a valid email address' : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color={mode === 'dark' ? 'info' : 'action'} />
                </InputAdornment>
              ),
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
            InputLabelProps={{
              sx: { color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Reset Password
          </Button>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Typography variant="body2" color={mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
              Remember your password?
            </Typography>
            <Link 
              href="/SignIn" 
              variant="body2" 
              underline="hover"
              sx={{ color: mode === 'dark' ? '#90caf9' : undefined }}
            >
              Sign In
            </Link>
          </Stack>
        </FormBox>
      </ForgotPasswordContainer>
    </AppTheme>
  );
} 