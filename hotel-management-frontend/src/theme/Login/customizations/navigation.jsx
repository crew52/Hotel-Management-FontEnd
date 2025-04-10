import { alpha } from '@mui/material/styles';
import { brand } from '../themePrimitives';

export const navigationCustomizations = {
  MuiMenu: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiPaper-root': {
          borderRadius: 10,
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        },
      }),
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
    defaultProps: {
      underline: 'none',
    },
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
        '& .MuiLink-root': {
          color: (theme.vars || theme).palette.text.secondary,
          '&:hover': {
            color: (theme.vars || theme).palette.primary.main,
          },
        },
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 500,
        borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
        borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
        '&.Mui-selected': {
          backgroundColor: alpha(brand[100], 0.2),
          color: (theme.vars || theme).palette.primary.main,
        },
        ...theme.applyStyles('dark', {
          '&.Mui-selected': {
            backgroundColor: alpha(brand[800], 0.2),
          },
        }),
      }),
    },
  },
}; 