import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import App from './App';
import { theme } from './theme';

// Erstelle eine Cache-Instanz für bessere Performance
const cache = createCache({
  key: 'css',
  prepend: true,
  stylisPlugins: [],
});

// Füge die Roboto-Schriftart hinzu
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
document.head.appendChild(link);

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
