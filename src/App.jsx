/**
 * App.jsx - Hauptkomponente der Kegelbuch-Anwendung
 *
 * Diese Datei ist der Einstiegspunkt der App und verwaltet:
 * - Den aktuell ausgewählten Kegelabend
 * - Die Liste aller gespeicherten Kegelabende
 * - Die Konfiguration (Strafen, Gebühren, etc.)
 * - Auto-Save Funktionalität
 * - JSON Import/Export
 */

import React, { useState, useEffect } from 'react';

// Material-UI Komponenten für das Layout und Design
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

// Icons für die Buttons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';

// Eigene Komponenten und Services
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
 * Haupt-App Komponente
 * Rendert die gesamte Anwendung und verwaltet den globalen State
 */
function App() {
  // ============================================
  // STATE DEFINITIONEN
  // ============================================

  // Konfiguration mit Strafen, Gebühren, Spielarten
  const [config, setConfig] = useState(defaultConfig);

  // Liste aller gespeicherten Kegelabende
  const [kegelabende, setKegelabende] = useState([]);

  // Der aktuell angezeigte/bearbeitete Kegelabend
  const [currentAbend, setCurrentAbend] = useState(null);

  // Für Benachrichtigungen (Toast-Messages)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ============================================
  // EFFECTS (Seiteneffekte)
  // ============================================

  /**
   * Beim Start der App:
   * - Lade gespeicherte Konfiguration aus LocalStorage
   * - Lade alle gespeicherten Kegelabende
   * - Zeige den letzten Kegelabend an (falls vorhanden)
   */
  useEffect(() => {
    const savedConfig = loadConfig(defaultConfig);
    const savedAbende = loadKegelabende();
    setConfig(savedConfig);
    setKegelabende(savedAbende);

    // Automatisch den letzten Abend laden
    if (savedAbende.length > 0) {
      setCurrentAbend(savedAbende[savedAbende.length - 1]);
    }
  }, []);

  /**
   * AUTO-SAVE: Bei jeder Änderung am aktuellen Kegelabend
   * wird automatisch gespeichert (kein manuelles Speichern nötig)
   */
  useEffect(() => {
    // Nichts tun wenn kein Abend ausgewählt ist
    if (!currentAbend) return;

    // Prüfen ob der Abend schon existiert oder neu ist
    const existingIndex = kegelabende.findIndex(a => a.id === currentAbend.id);
    let updatedAbende;

    if (existingIndex >= 0) {
      // Existierenden Abend aktualisieren
      updatedAbende = [...kegelabende];
      updatedAbende[existingIndex] = currentAbend;
    } else {
      // Neuen Abend zur Liste hinzufügen
      updatedAbende = [...kegelabende, currentAbend];
    }

    // State und LocalStorage aktualisieren
    setKegelabende(updatedAbende);
    saveKegelabende(updatedAbende);
    saveConfig(config);
  }, [currentAbend]);

  // ============================================
  // EVENT HANDLER
  // ============================================

  /**
   * Erstellt einen neuen, leeren Kegelabend mit heutigem Datum
   */
  const handleNewAbend = () => {
    const newAbend = createEmptyKegelabend();
    setCurrentAbend(newAbend);
  };

  /**
   * Wird aufgerufen wenn sich Daten im Kegelabend ändern
   * (z.B. neuer Spieler, Strafe eingetragen, etc.)
   * Triggert automatisch den Auto-Save Effect
   */
  const handleUpdateAbend = updatedAbend => {
    setCurrentAbend(updatedAbend);
  };

  /**
   * Exportiert alle Daten als JSON-Datei zum Download
   * Gut für Backups oder Übertragung auf anderen PC
   */
  const handleExport = () => {
    exportToJSON();
    setSnackbar({ open: true, message: 'Export erfolgreich!', severity: 'success' });
  };

  /**
   * Importiert Daten aus einer JSON-Datei
   * Überschreibt die aktuellen Daten!
   */
  const handleImport = async event => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      setKegelabende(data.kegelabende || []);
      if (data.config) setConfig(data.config);
      // Den letzten importierten Abend anzeigen
      if (data.kegelabende?.length > 0) {
        setCurrentAbend(data.kegelabende[data.kegelabende.length - 1]);
      }
      setSnackbar({ open: true, message: 'Import erfolgreich!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Import fehlgeschlagen!', severity: 'error' });
    }
    // Input zurücksetzen damit gleiche Datei erneut gewählt werden kann
    event.target.value = '';
  };

  // ============================================
  // RENDER - Was auf dem Bildschirm angezeigt wird
  // ============================================

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* ==========================================
          HEADER-BEREICH
          - Titel der App
          - Aktions-Buttons (Neuer Abend, Export, Import)
          ========================================== */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            🎳 Kegelbuch
          </Typography>
          <Stack direction="row" spacing={1}>
            {/* Button: Neuen leeren Kegelabend erstellen */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewAbend}
            >
              Neuer Abend
            </Button>
            {/* Button: Alle Daten als JSON exportieren */}
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
              Export
            </Button>
            {/* Button: JSON-Datei importieren (verstecktes File-Input) */}
            <Button variant="outlined" component="label" startIcon={<FileUploadIcon />}>
              Import
              <input type="file" hidden accept=".json" onChange={handleImport} />
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ==========================================
          HAUPTBEREICH
          - Zeigt den aktuellen Kegelabend als Tabelle
          - Oder eine Willkommensnachricht wenn kein Abend ausgewählt
          ========================================== */}
      {currentAbend ? (
        <Paper sx={{ p: 2 }}>
          {/* Datum-Auswahl für den Kegelabend */}
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
          {/* Die eigentliche Tabelle mit Spielern, Strafen, etc. */}
          <KegelabendTable
            kegelabend={currentAbend}
            config={config}
            onUpdate={handleUpdateAbend}
          />
        </Paper>
      ) : (
        // Willkommens-Ansicht wenn noch kein Abend ausgewählt
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
          LISTE BISHERIGER KEGELABENDE
          - Buttons zum schnellen Wechseln zwischen Abenden
          - Nur sichtbar wenn mindestens ein Abend existiert
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
                // Aktuell ausgewählter Abend ist hervorgehoben (contained)
                variant={currentAbend?.id === abend.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setCurrentAbend(abend)}
              >
                {/* Datum im deutschen Format anzeigen (TT.MM.JJJJ) */}
                {new Date(abend.datum).toLocaleDateString('de-DE')}
              </Button>
            ))}
          </Stack>
        </Paper>
      )}

      {/* ==========================================
          BENACHRICHTIGUNGEN (Snackbar/Toast)
          - Zeigt Erfolgs- oder Fehlermeldungen an
          - Verschwindet automatisch nach 3 Sekunden
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
