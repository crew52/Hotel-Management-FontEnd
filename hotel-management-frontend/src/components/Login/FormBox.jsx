import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  maxWidth: '450px',
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  margin: '40px auto',
  position: 'relative',
  overflow: 'hidden',
  '& .MuiTextField-root': {
    margin: theme.spacing(1, 0),
  },
  '& .MuiButton-root': {
    margin: theme.spacing(2, 0, 1),
  },
}));

export default FormBox; 