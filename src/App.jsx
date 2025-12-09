/**
 * App.jsx - Main component of the Kegelbuch application
 *
 * This file is the entry point of the app and manages:
 * - The currently selected bowling evening (Kegelabend)
 * - The list of all saved bowling evenings
 * - The configuration (penalties, fees, etc.)
 * - Auto-save functionality
 * - JSON import/export
 */

import React, { useState, useEffect } from 'react';

// Material-UI components for layout and design
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';

// Icons for buttons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';

// Custom components and services
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

/**
 * Main App Component
 * Renders the entire application and manages global state
 */
function App() {
  // ============================================
  // STATE DEFINITIONS
  // ============================================

  // Configuration with penalties, fees, game types
  const [config, setConfig] = useState(defaultConfig);

  // List of all saved bowling evenings
  const [kegelabende, setKegelabende] = useState([]);

  // The currently displayed/edited bowling evening
  const [currentAbend, setCurrentAbend] = useState(null);

  // For notifications (toast messages)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ============================================
  // EFFECTS (Side Effects)
  // ============================================

  /**
   * On app startup:
   * - Load saved configuration from LocalStorage
   * - Load all saved bowling evenings
   * - Display the most recent evening (if exists)
   */
  useEffect(() => {
    const savedConfig = loadConfig(defaultConfig);
    const savedAbende = loadKegelabende();
    setConfig(savedConfig);
    setKegelabende(savedAbende);

    // Automatically load the most recent evening
    if (savedAbende.length > 0) {
      setCurrentAbend(savedAbende[savedAbende.length - 1]);
    }
  }, []);

  /**
   * AUTO-SAVE: On every change to the current bowling evening,
   * data is automatically saved (no manual save needed)
   */
  useEffect(() => {
    // Do nothing if no evening is selected
    if (!currentAbend) return;

    // Check if evening already exists or is new
    const existingIndex = kegelabende.findIndex(a => a.id === currentAbend.id);
    let updatedAbende;

    if (existingIndex >= 0) {
      // Update existing evening
      updatedAbende = [...kegelabende];
      updatedAbende[existingIndex] = currentAbend;
    } else {
      // Add new evening to list
      updatedAbende = [...kegelabende, currentAbend];
    }

    // Update state and LocalStorage
    setKegelabende(updatedAbende);
    saveKegelabende(updatedAbende);
    saveConfig(config);
  }, [currentAbend]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Creates a new, empty bowling evening with today's date
   */
  const handleNewAbend = () => {
    const newAbend = createEmptyKegelabend();
    setCurrentAbend(newAbend);
  };

  /**
   * Called when data in the bowling evening changes
   * (e.g., new player, penalty entered, etc.)
   * Automatically triggers the auto-save effect
   */
  const handleUpdateAbend = updatedAbend => {
    setCurrentAbend(updatedAbend);
  };

  /**
   * Exports all data as JSON file for download
   * Useful for backups or transferring to another PC
   */
  const handleExport = () => {
    exportToJSON();
    setSnackbar({ open: true, message: 'Export erfolgreich!', severity: 'success' });
  };

  /**
   * Imports data from a JSON file
   * WARNING: Overwrites current data!
   */
  const handleImport = async event => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      setKegelabende(data.kegelabende || []);
      if (data.config) setConfig(data.config);
      // Display the most recently imported evening
      if (data.kegelabende?.length > 0) {
        setCurrentAbend(data.kegelabende[data.kegelabende.length - 1]);
      }
      setSnackbar({ open: true, message: 'Import erfolgreich!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Import fehlgeschlagen!', severity: 'error' });
    }
    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  // ============================================
  // RENDER - What is displayed on screen
  // ============================================

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* ==========================================
          HEADER SECTION
          - App title
          - Action buttons (New Evening, Export, Import)
          ========================================== */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            🎳 Kegelbuch
          </Typography>
          <Stack direction="row" spacing={1}>
            {/* Button: Create new empty bowling evening */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewAbend}
            >
              Neuer Abend
            </Button>
            {/* Button: Export all data as JSON */}
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
              Export
            </Button>
            {/* Button: Import JSON file (hidden file input) */}
            <Button variant="outlined" component="label" startIcon={<FileUploadIcon />}>
              Import
              <input type="file" hidden accept=".json" onChange={handleImport} />
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ==========================================
          MAIN CONTENT AREA
          - Shows current bowling evening as table
          - Or welcome message if no evening selected
          ========================================== */}
      {currentAbend ? (
        <Paper sx={{ p: 2 }}>
          {/* Date picker for the bowling evening */}
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
          {/* The actual table with players, penalties, etc. */}
          <KegelabendTable
            kegelabend={currentAbend}
            config={config}
            onUpdate={handleUpdateAbend}
          />
        </Paper>
      ) : (
        // Welcome view when no evening is selected
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

      {/* ==========================================
          PREVIOUS EVENINGS LIST
          - Buttons for quickly switching between evenings
          - Only visible if at least one evening exists
          ========================================== */}
      {kegelabende.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bisherige Kegelabende
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {kegelabende.map(abend => (
              <Button
                key={abend.id}
                // Currently selected evening is highlighted (contained)
                variant={currentAbend?.id === abend.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setCurrentAbend(abend)}
              >
                {/* Display date in German format (DD.MM.YYYY) */}
                {new Date(abend.datum).toLocaleDateString('de-DE')}
              </Button>
            ))}
          </Stack>
        </Paper>
      )}

      {/* ==========================================
          NOTIFICATIONS (Snackbar/Toast)
          - Shows success or error messages
          - Auto-hides after 3 seconds
          ========================================== */}
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
