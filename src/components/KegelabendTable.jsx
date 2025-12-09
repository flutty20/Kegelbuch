/**
 * KegelabendTable.jsx - Tabellen-Komponente für einen Kegelabend
 *
 * Diese Komponente zeigt die Haupttabelle eines Kegelabends an:
 * - Spalten: Name | Startgebühr | Strafen (Kalle, Stina, etc.) | Spiele (WM, GS) | Summe
 * - Jede Zeile ist ein Spieler
 * - Alle Felder sind direkt editierbar
 * - Neue Spieler können hinzugefügt werden
 * - Spieler können gelöscht werden
 *
 * Props:
 * - kegelabend: Das Kegelabend-Objekt mit allen Spielern
 * - config: Konfiguration (Strafen, Spielarten, Gebühren)
 * - onUpdate: Callback wenn sich etwas ändert (für Auto-Save)
 */

import React from 'react';

// Material-UI Komponenten für die Tabelle
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

/**
 * Berechnet die Gesamtsumme für einen einzelnen Spieler
 *
 * Formel: Startgebühr + (Anzahl jeder Strafe × Preis der Strafe)
 *
 * @param {Object} player - Der Spieler mit seinen Strafen
 * @param {Object} config - Die Konfiguration mit Strafpreisen
 * @returns {number} - Gesamtbetrag in Euro
 */
const calculatePlayerTotal = (player, config) => {
  // Starte mit der Grundgebühr (z.B. 6€)
  let total = config.startgebuehr;

  // Für jede konfigurierte Strafe...
  config.strafen.forEach(strafe => {
    // Hole die Anzahl dieser Strafe für den Spieler (oder 0 wenn nicht vorhanden)
    const count = player.strafen[strafe.id] || 0;
    // Addiere: Anzahl × Preis
    total += count * strafe.preis;
  });

  return total;
};

/**
 * Hauptkomponente: Die editierbare Kegelabend-Tabelle
 */
const KegelabendTable = ({ kegelabend, config, onUpdate }) => {
  // ============================================
  // EVENT HANDLER für Änderungen in der Tabelle
  // ============================================

  /**
   * Wird aufgerufen wenn ein Spieler-Feld geändert wird (z.B. Name)
   * @param {string} playerId - ID des Spielers
   * @param {string} field - Name des Feldes (z.B. 'name')
   * @param {any} value - Neuer Wert
   */
  const handlePlayerChange = (playerId, field, value) => {
    // Alle Spieler durchgehen und den richtigen aktualisieren
    const updatedSpieler = kegelabend.spieler.map(player => {
      if (player.id === playerId) {
        return { ...player, [field]: value };
      }
      return player;
    });
    // Änderung nach oben melden (triggert Auto-Save)
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  /**
   * Wird aufgerufen wenn eine Strafe eingetragen wird
   * @param {string} playerId - ID des Spielers
   * @param {string} strafeId - ID der Strafe (z.B. 'kalle')
   * @param {string} value - Anzahl als String (wird zu Nummer konvertiert)
   */
  const handleStrafeChange = (playerId, strafeId, value) => {
    // String zu Nummer konvertieren (leerer String wird zu 0)
    const numValue = parseInt(value, 10) || 0;
    const updatedSpieler = kegelabend.spieler.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          strafen: { ...player.strafen, [strafeId]: numValue },
        };
      }
      return player;
    });
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  /**
   * Wird aufgerufen wenn ein Spielergebnis eingetragen wird
   * @param {string} playerId - ID des Spielers
   * @param {string} spielId - ID der Spielart (z.B. 'wm', 'gs')
   * @param {string} value - Das Ergebnis (beliebiger Text)
   */
  const handleSpielChange = (playerId, spielId, value) => {
    const updatedSpieler = kegelabend.spieler.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          spiele: { ...player.spiele, [spielId]: value },
        };
      }
      return player;
    });
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  /**
   * Fügt einen neuen, leeren Spieler zur Tabelle hinzu
   */
  const addPlayer = () => {
    const newPlayer = {
      id: crypto.randomUUID(), // Eindeutige ID generieren
      name: '',
      anwesend: true,
      strafen: {}, // Noch keine Strafen
      spiele: {}, // Noch keine Spielergebnisse
    };
    onUpdate({ ...kegelabend, spieler: [...kegelabend.spieler, newPlayer] });
  };

  /**
   * Entfernt einen Spieler aus der Tabelle
   * @param {string} playerId - ID des zu löschenden Spielers
   */
  const removePlayer = playerId => {
    const updatedSpieler = kegelabend.spieler.filter(p => p.id !== playerId);
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  // ============================================
  // BERECHNUNGEN
  // ============================================

  // Gesamtsumme aller Spieler berechnen (für die Fußzeile)
  const grandTotal = kegelabend.spieler.reduce((sum, player) => {
    return sum + calculatePlayerTotal(player, config);
  }, 0);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 150 }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 80 }} align="center">
                Start ({config.startgebuehr}
                {config.waehrung})
              </TableCell>
              {config.strafen.map(strafe => (
                <TableCell
                  key={strafe.id}
                  sx={{ color: 'white', fontWeight: 'bold', width: 70 }}
                  align="center"
                >
                  <Tooltip title={`${strafe.description} (${strafe.preis}${config.waehrung})`}>
                    <span>{strafe.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
              {config.spielarten.map(spiel => (
                <TableCell
                  key={spiel.id}
                  sx={{ color: 'white', fontWeight: 'bold', width: 70 }}
                  align="center"
                >
                  <Tooltip title={spiel.description}>
                    <span>{spiel.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 90 }} align="right">
                Summe
              </TableCell>
              <TableCell sx={{ color: 'white', width: 50 }} align="center">
                {/* Delete column */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kegelabend.spieler.map((player, index) => {
              const playerTotal = calculatePlayerTotal(player, config);
              return (
                <TableRow
                  key={player.id}
                  sx={{ backgroundColor: index % 2 === 0 ? 'grey.50' : 'white' }}
                >
                  <TableCell>
                    <TextField
                      value={player.name}
                      onChange={e => handlePlayerChange(player.id, 'name', e.target.value)}
                      placeholder="Name eingeben"
                      variant="standard"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {config.startgebuehr.toFixed(2)}
                      {config.waehrung}
                    </Typography>
                  </TableCell>
                  {config.strafen.map(strafe => (
                    <TableCell key={strafe.id} align="center">
                      <TextField
                        type="number"
                        value={player.strafen[strafe.id] || ''}
                        onChange={e => handleStrafeChange(player.id, strafe.id, e.target.value)}
                        variant="standard"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: 'center', width: 40 } }}
                      />
                    </TableCell>
                  ))}
                  {config.spielarten.map(spiel => (
                    <TableCell key={spiel.id} align="center">
                      <TextField
                        value={player.spiele[spiel.id] || ''}
                        onChange={e => handleSpielChange(player.id, spiel.id, e.target.value)}
                        variant="standard"
                        size="small"
                        inputProps={{ style: { textAlign: 'center', width: 40 } }}
                      />
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {playerTotal.toFixed(2)}
                      {config.waehrung}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => removePlayer(player.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Add player row */}
            <TableRow>
              <TableCell colSpan={config.strafen.length + config.spielarten.length + 3}>
                <IconButton onClick={addPlayer} color="primary" size="small">
                  <AddIcon /> <Typography variant="body2">Spieler hinzufügen</Typography>
                </IconButton>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {grandTotal.toFixed(2)}
                  {config.waehrung}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KegelabendTable;
