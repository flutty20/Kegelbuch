import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Theme für die Anwendung
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    mode: 'light',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Kegelbuch
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Willkommen beim Kegelverein
          </Typography>
          <Typography variant="body1" paragraph>
            Verwalte deine Kegelabende und Ergebnisse bequem online.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
