import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h2: {
      fontWeight: 300,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 400,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 22px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
