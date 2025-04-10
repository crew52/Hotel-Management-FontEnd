import { alpha } from '@mui/material/styles';
import { gray, brand } from '../themePrimitives';

export const surfacesCustomizations = {
  MuiCard: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        ...(ownerState.variant === 'outlined' && {
          borderColor: gray[200],
          background: 'transparent',
          ...theme.applyStyles('dark', {
            borderColor: alpha(gray[700], 0.5),
          }),
        }),
        ...(ownerState.variant === 'elevation' && {
          boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 2px 8px 0px',
          ...theme.applyStyles('dark', {
            boxShadow: 'hsla(220, 30%, 5%, 0.4) 0px 5px 12px 0px',
          }),
        }),
      }),
    },
    variants: [
      {
        props: { variant: 'highlighted' },
        style: ({ theme }) => ({
          position: 'relative',
          border: '1px solid',
          borderColor: alpha(brand[300], 0.3),
          backgroundColor: alpha(brand[50], 0.2),
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -1,
            right: -1,
            left: -1,
            height: 5,
            backgroundColor: brand[500],
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          },
          ...theme.applyStyles('dark', {
            borderColor: alpha(brand[700], 0.4),
            backgroundColor: alpha(brand[800], 0.3),
            '&::after': {
              backgroundColor: brand[400],
            },
          }),
        }),
      },
    ],
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: gray[200],
        ...theme.applyStyles('dark', {
          borderColor: alpha(gray[700], 0.8),
        }),
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        ...(ownerState.variant === 'outlined' && {
          borderColor: gray[200],
          ...theme.applyStyles('dark', {
            borderColor: alpha(gray[700], 0.5),
          }),
        }),
        ...(ownerState.elevation === 1 && {
          boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 2px 8px 0px',
          ...theme.applyStyles('dark', {
            boxShadow: 'hsla(220, 30%, 5%, 0.3) 0px 5px 12px 0px',
          }),
        }),
        ...(ownerState.elevation === 2 && {
          boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px',
          ...theme.applyStyles('dark', {
            boxShadow: 'hsla(220, 30%, 5%, 0.4) 0px 5px 15px 0px',
          }),
        }),
        ...(ownerState.elevation === 3 && {
          boxShadow: 'hsla(220, 30%, 5%, 0.07) 0px 5px 15px 0px',
          ...theme.applyStyles('dark', {
            boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px',
          }),
        }),
        ...(ownerState.elevation === 4 && {
          boxShadow: 'hsla(220, 30%, 5%, 0.09) 0px 8px 20px 0px',
          ...theme.applyStyles('dark', {
            boxShadow: 'hsla(220, 30%, 5%, 0.6) 0px 8px 20px 0px',
          }),
        }),
        ...(ownerState.elevation === 5 && {
          boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 10px 24px 0px',
          ...theme.applyStyles('dark', {
            boxShadow: 'hsla(220, 30%, 5%, 0.7) 0px 10px 24px 0px',
          }),
        }),
      }),
    },
  },
}; 