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

import React, { useState, useEffect, useCallback } from 'react';

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
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';

// Icons for buttons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import EuroIcon from '@mui/icons-material/Euro';
import DeleteIcon from '@mui/icons-material/Delete';

// Custom components and services
import KegelabendTable from './components/KegelabendTable';
import { defaultConfig, createEmptyKegelabend } from './config/defaultConfig';
import {
  loadKegelabende,
  saveKegelabende,
  loadConfig,
  saveConfig,
  loadSpieler,
  saveSpieler,
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

  // Saved player names for quick-add feature
  const [savedPlayers, setSavedPlayers] = useState([]);

  // Settings menu and dialogs
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // New penalty form
  const [newPenalty, setNewPenalty] = useState({ label: '', description: '', preis: 0.5, inverted: false });

  // ============================================
  // EFFECTS (Side Effects)
  // ============================================

  /**
   * On app startup:
   * - Load saved configuration from LocalStorage
   * - Merge with defaultConfig to include new penalties
   * - Load all saved bowling evenings
   * - Display the most recent evening (if exists)
   */
  useEffect(() => {
    const savedConfig = loadConfig(defaultConfig);
    
    // Always use the latest penalties/game types from defaultConfig
    // This ensures new penalties (like Kranz, Volle) are shown
    const mergedConfig = {
      ...savedConfig,
      strafen: defaultConfig.strafen,
      spielarten: defaultConfig.spielarten,
    };
    
    const savedAbende = loadKegelabende();
    const savedPlayersList = loadSpieler();
    
    setConfig(mergedConfig);
    setKegelabende(savedAbende);
    setSavedPlayers(savedPlayersList);

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
    if (!currentAbend) return;

    // Use functional update to avoid stale closure
    setKegelabende(prevAbende => {
      const existingIndex = prevAbende.findIndex(a => a.id === currentAbend.id);
      let updatedAbende;

      if (existingIndex >= 0) {
        updatedAbende = [...prevAbende];
        updatedAbende[existingIndex] = currentAbend;
      } else {
        updatedAbende = [...prevAbende, currentAbend];
      }

      // Save to LocalStorage
      saveKegelabende(updatedAbende);
      return updatedAbende;
    });
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
   * Updates the saved players list and persists to storage
   */
  const updateSavedPlayers = useCallback((updateFn) => {
    setSavedPlayers(prev => {
      const updated = updateFn(prev);
      saveSpieler(updated);
      return updated;
    });
  }, []);

  /**
   * Adds a new player to the saved players list
   */
  const addSavedPlayer = useCallback((name = newPlayerName) => {
    const trimmed = typeof name === 'string' ? name.trim() : '';
    if (!trimmed) return;
    
    updateSavedPlayers(prev => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed].sort();
    });
    setNewPlayerName('');
  }, [newPlayerName, updateSavedPlayers]);

  /**
   * Removes a player from the saved players list
   */
  const removeSavedPlayer = useCallback((name) => {
    updateSavedPlayers(prev => prev.filter(p => p !== name));
  }, [updateSavedPlayers]);

  /**
   * Updates a penalty price in the config
   */
  const handlePriceChange = (strafeId, newPrice) => {
    const updatedConfig = {
      ...config,
      strafen: config.strafen.map(s =>
        s.id === strafeId ? { ...s, preis: parseFloat(newPrice) || 0 } : s
      ),
    };
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
  };

  /**
   * Updates the entry fee (Startgebühr)
   */
  const handleStartgebuehrChange = (newValue) => {
    const updatedConfig = {
      ...config,
      startgebuehr: parseFloat(newValue) || 0,
    };
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
  };

  /**
   * Adds a new penalty to the config
   */
  const handleAddPenalty = () => {
    if (!newPenalty.label.trim()) return;
    
    const id = newPenalty.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Check if ID already exists
    if (config.strafen.some(s => s.id === id)) {
      setSnackbar({ open: true, message: 'Strafe existiert bereits!', severity: 'error' });
      return;
    }
    
    const updatedConfig = {
      ...config,
      strafen: [...config.strafen, { ...newPenalty, id }],
    };
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
    setNewPenalty({ label: '', description: '', preis: 0.5, inverted: false });
  };

  /**
   * Removes a penalty from the config
   */
  const handleRemovePenalty = (strafeId) => {
    const updatedConfig = {
      ...config,
      strafen: config.strafen.filter(s => s.id !== strafeId),
    };
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
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
          <Stack direction="row" spacing={1} alignItems="center">
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

            {/* Settings Menu */}
            <IconButton
              onClick={(e) => setSettingsAnchor(e.currentTarget)}
              color="primary"
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={() => setSettingsAnchor(null)}
            >
              <MenuItem onClick={() => { setPlayerDialogOpen(true); setSettingsAnchor(null); }}>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText>Spieler-Stammdaten</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => { setPriceDialogOpen(true); setSettingsAnchor(null); }}>
                <ListItemIcon><EuroIcon /></ListItemIcon>
                <ListItemText>Preise konfigurieren</ListItemText>
              </MenuItem>
            </Menu>
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
            savedPlayers={savedPlayers}
            onAddSavedPlayer={addSavedPlayer}
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

      {/* ==========================================
          PLAYER MANAGEMENT DIALOG
          ========================================== */}
      <Dialog open={playerDialogOpen} onClose={() => setPlayerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Spieler-Stammdaten verwalten</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Gespeicherte Spieler können schnell zu jedem Kegelabend hinzugefügt werden.
          </Typography>
          
          {/* Add new player */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              label="Neuer Spieler"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              size="small"
              fullWidth
              onKeyPress={(e) => e.key === 'Enter' && addSavedPlayer()}
            />
            <Button variant="contained" onClick={addSavedPlayer} disabled={!newPlayerName.trim()}>
              Hinzufügen
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* List of saved players */}
          {savedPlayers.length > 0 ? (
            <Stack spacing={1}>
              {savedPlayers.map(name => (
                <Stack key={name} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography>{name}</Typography>
                  <IconButton size="small" onClick={() => removeSavedPlayer(name)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary" textAlign="center">
              Noch keine Spieler gespeichert
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlayerDialogOpen(false)}>Schließen</Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
          PRICE CONFIGURATION DIALOG
          ========================================== */}
      <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Preise konfigurieren</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hier können die Startgebühr und Strafpreise angepasst werden.
          </Typography>

          <Table size="small">
            <TableBody>
              {/* Entry fee */}
              <TableRow>
                <TableCell><strong>Startgebühr</strong></TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={config.startgebuehr}
                    onChange={(e) => handleStartgebuehrChange(e.target.value)}
                    size="small"
                    sx={{ width: 100 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">€</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: 0.5 }}
                  />
                </TableCell>
              </TableRow>

              {/* Separator */}
              <TableRow>
                <TableCell colSpan={2}>
                  <Divider />
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Strafen</Typography>
                </TableCell>
              </TableRow>

              {/* Penalties */}
              {config.strafen.map(strafe => (
                <TableRow key={strafe.id}>
                  <TableCell>
                    <strong>{strafe.label}</strong>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {strafe.description}
                      {strafe.inverted && ' (andere zahlen)'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                      <TextField
                        type="number"
                        value={strafe.preis}
                        onChange={(e) => handlePriceChange(strafe.id, e.target.value)}
                        size="small"
                        sx={{ width: 100 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        }}
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemovePenalty(strafe.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add new penalty form */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Neue Strafe hinzufügen</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Name"
                value={newPenalty.label}
                onChange={(e) => setNewPenalty({ ...newPenalty, label: e.target.value })}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Preis"
                type="number"
                value={newPenalty.preis}
                onChange={(e) => setNewPenalty({ ...newPenalty, preis: parseFloat(e.target.value) || 0 })}
                size="small"
                sx={{ width: 100 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Stack>
            <TextField
              label="Beschreibung"
              value={newPenalty.description}
              onChange={(e) => setNewPenalty({ ...newPenalty, description: e.target.value })}
              size="small"
              fullWidth
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newPenalty.inverted}
                    onChange={(e) => setNewPenalty({ ...newPenalty, inverted: e.target.checked })}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Andere zahlen (wie Kranz/Volle)</Typography>}
              />
              <Button 
                variant="contained" 
                size="small"
                onClick={handleAddPenalty}
                disabled={!newPenalty.label.trim()}
              >
                Hinzufügen
              </Button>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPriceDialogOpen(false)}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
