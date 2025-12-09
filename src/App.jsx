import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  IconButton,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import KegelabendTable from './components/KegelabendTable';
import { defaultConfig, createEmptyKegelabend } from './config/defaultConfig';
import {
  loadKegelabende,
  saveKegelabende,
  loadConfig,
  saveConfig,
  exportToJSON,
  importFromJSON,
} from './services/storageService';

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [kegelabende, setKegelabende] = useState([]);
  const [currentAbend, setCurrentAbend] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load data on mount
  useEffect(() => {
    const savedConfig = loadConfig(defaultConfig);
    const savedAbende = loadKegelabende();
    setConfig(savedConfig);
    setKegelabende(savedAbende);

    // If there are existing evenings, load the most recent one
    if (savedAbende.length > 0) {
      setCurrentAbend(savedAbende[savedAbende.length - 1]);
    }
  }, []);

  // Auto-save when currentAbend changes
  useEffect(() => {
    if (!currentAbend) return;

    const existingIndex = kegelabende.findIndex(a => a.id === currentAbend.id);
    let updatedAbende;

    if (existingIndex >= 0) {
      updatedAbende = [...kegelabende];
      updatedAbende[existingIndex] = currentAbend;
    } else {
      updatedAbende = [...kegelabende, currentAbend];
    }

    setKegelabende(updatedAbende);
    saveKegelabende(updatedAbende);
    saveConfig(config);
  }, [currentAbend]);

  // Create new Kegelabend
  const handleNewAbend = () => {
    const newAbend = createEmptyKegelabend();
    setCurrentAbend(newAbend);
  };

  // Update current Kegelabend
  const handleUpdateAbend = updatedAbend => {
    setCurrentAbend(updatedAbend);
  };

  // Export to JSON
  const handleExport = () => {
    exportToJSON();
    setSnackbar({ open: true, message: 'Export erfolgreich!', severity: 'success' });
  };

  // Import from JSON
  const handleImport = async event => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      setKegelabende(data.kegelabende || []);
      if (data.config) setConfig(data.config);
      if (data.kegelabende?.length > 0) {
        setCurrentAbend(data.kegelabende[data.kegelabende.length - 1]);
      }
      setSnackbar({ open: true, message: 'Import erfolgreich!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Import fehlgeschlagen!', severity: 'error' });
    }
    event.target.value = '';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            🎳 Kegelbuch
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewAbend}
            >
              Neuer Abend
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!currentAbend}
            >
              Speichern
            </Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
              Export
            </Button>
            <Button variant="outlined" component="label" startIcon={<FileUploadIcon />}>
              Import
              <input type="file" hidden accept=".json" onChange={handleImport} />
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Current Kegelabend */}
      {currentAbend ? (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Kegelabend vom</Typography>
            <TextField
              type="date"
              value={currentAbend.datum}
              onChange={e =>
                handleUpdateAbend({ ...currentAbend, datum: e.target.value })
              }
              size="small"
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <KegelabendTable
            kegelabend={currentAbend}
            config={config}
            onUpdate={handleUpdateAbend}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Kein Kegelabend ausgewählt
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewAbend}
            sx={{ mt: 2 }}
          >
            Neuen Kegelabend starten
          </Button>
        </Paper>
      )}

      {/* Previous Kegelabende List */}
      {kegelabende.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bisherige Kegelabende
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {kegelabende.map(abend => (
              <Button
                key={abend.id}
                variant={currentAbend?.id === abend.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setCurrentAbend(abend)}
              >
                {new Date(abend.datum).toLocaleDateString('de-DE')}
              </Button>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
