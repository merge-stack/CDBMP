import { createTheme } from '@mui/material/styles';

/**
 * Color palette constants
 */
export const colors = {
  primary: {
    main: '#2F4432', // Dark green
    dark: '#1e2d21',
    light: '#3a5340',
  },
  secondary: {
    main: '#C8D5B9', // Light sage green
    light: '#E8F0E0', // Very light green
    dark: '#b9c7aa',
  },
  warning: {
    main: '#FFD700', // Yellow for warning indicators
    light: '#ffe033',
    dark: '#ccac00',
  },
  error: {
    main: '#FF4444', // Red for map layer outlines
    light: '#ff6767',
    dark: '#cc3636',
  },
  text: {
    primary: '#2F4432',
    secondary: '#666666',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    panel: '#E8F0E0',
  },
};

/**
 * Border radius constants
 */
export const borderRadius = {
  small: '8px',
  medium: '12px',
  large: '20px',
  xlarge: '24px',
};

/**
 * Spacing constants
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

/**
 * Main theme configuration
 */
const theme = createTheme({
  palette: colors,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      color: colors.text.secondary,
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.large,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(47, 68, 50, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.medium,
          boxShadow: '0px 2px 8px rgba(47, 68, 50, 0.08)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme; 