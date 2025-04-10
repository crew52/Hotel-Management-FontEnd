import { alpha } from '@mui/material/styles';
import { gray, brand } from '../themePrimitives';

export const inputsCustomizations = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        ...(ownerState.variant === 'contained' &&
          ownerState.color === 'primary' && {
            backgroundColor: (theme.vars || theme).palette.primary.main,
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: (theme.vars || theme).palette.primary.dark,
              boxShadow: 'none',
            },
          }),
        ...(ownerState.variant === 'outlined' && {
          borderColor: alpha(gray[300], 0.5),
          '&:hover': {
            borderColor: gray[300],
          },
          ...theme.applyStyles('dark', {
            borderColor: alpha(gray[700], 0.5),
            '&:hover': {
              borderColor: gray[700],
            },
          }),
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        marginBottom: theme.spacing(0.5),
        fontSize: theme.typography.body2.fontSize,
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
      }),
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        marginTop: theme.spacing(0.5),
        fontSize: theme.typography.caption.fontSize,
      }),
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        '&:not(.Mui-focused)': {
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(gray[300], 0.5),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: gray[300],
          },
          ...theme.applyStyles('dark', {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(gray[700], 0.5),
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: gray[700],
            },
          }),
        },
      }),
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        '&::before, &::after': {
          display: 'none',
        },
        backgroundColor: alpha(gray[200], 0.5),
        '&:hover': {
          backgroundColor: alpha(gray[200], 0.8),
        },
        '&.Mui-focused': {
          backgroundColor: alpha(gray[200], 0.8),
        },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(gray[800], 0.5),
          '&:hover': {
            backgroundColor: alpha(gray[800], 0.8),
          },
          '&.Mui-focused': {
            backgroundColor: alpha(gray[800], 0.8),
          },
        }),
      }),
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: () => ({
        '& .MuiSwitch-switchBase': {
          '&.Mui-checked': {
            color: brand[400],
            '& + .MuiSwitch-track': {
              backgroundColor: alpha(brand[200], 0.5),
              opacity: 1,
            },
          },
        },
        '& .MuiSwitch-track': {
          borderRadius: 12,
        },
        '& .MuiSwitch-thumb': {
          boxShadow: 'none',
        },
      }),
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: () => ({
        color: alpha(gray[500], 0.5),
      }),
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: () => ({
        color: alpha(gray[500], 0.5),
      }),
    },
  },
}; 