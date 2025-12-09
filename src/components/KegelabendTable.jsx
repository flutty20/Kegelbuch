/**
 * KegelabendTable.jsx - Table component for a bowling evening
 *
 * This component displays the main table for a bowling evening:
 * - Columns: Name | Entry Fee | Penalties (Kalle, Stina, etc.) | Games (WM, GS) | Total
 * - Each row represents a player
 * - All fields are directly editable
 * - New players can be added
 * - Players can be removed
 *
 * Props:
 * - kegelabend: The bowling evening object containing all players
 * - config: Configuration (penalties, game types, fees)
 * - onUpdate: Callback when something changes (for auto-save)
 */

import React from 'react';

// Material-UI components for the table
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
 * Calculates the total amount for a single player
 *
 * Formula: Entry Fee + (Count of each penalty × Price of penalty)
 *
 * @param {Object} player - The player with their penalties
 * @param {Object} config - The configuration with penalty prices
 * @returns {number} - Total amount in Euro
 */
const calculatePlayerTotal = (player, config) => {
  // Start with the base entry fee (e.g., 6€)
  let total = config.startgebuehr;

  // For each configured penalty...
  config.strafen.forEach(strafe => {
    // Get the count of this penalty for the player (or 0 if not present)
    const count = player.strafen[strafe.id] || 0;
    // Add: count × price
    total += count * strafe.preis;
  });

  return total;
};

/**
 * Main component: The editable bowling evening table
 */
const KegelabendTable = ({ kegelabend, config, onUpdate }) => {
  // ============================================
  // EVENT HANDLERS for changes in the table
  // ============================================

  /**
   * Called when a player field is changed (e.g., name)
   * @param {string} playerId - ID of the player
   * @param {string} field - Name of the field (e.g., 'name')
   * @param {any} value - New value
   */
  const handlePlayerChange = (playerId, field, value) => {
    // Go through all players and update the correct one
    const updatedSpieler = kegelabend.spieler.map(player => {
      if (player.id === playerId) {
        return { ...player, [field]: value };
      }
      return player;
    });
    // Report change upward (triggers auto-save)
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  /**
   * Called when a penalty is entered
   * @param {string} playerId - ID of the player
   * @param {string} strafeId - ID of the penalty (e.g., 'kalle')
   * @param {string} value - Count as string (converted to number)
   */
  const handleStrafeChange = (playerId, strafeId, value) => {
    // Convert string to number (empty string becomes 0)
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
   * Called when a game result is entered
   * @param {string} playerId - ID of the player
   * @param {string} spielId - ID of the game type (e.g., 'wm', 'gs')
   * @param {string} value - The result (any text)
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
   * Adds a new, empty player to the table
   */
  const addPlayer = () => {
    const newPlayer = {
      id: crypto.randomUUID(), // Generate unique ID
      name: '',
      anwesend: true,
      strafen: {}, // No penalties yet
      spiele: {}, // No game results yet
    };
    onUpdate({ ...kegelabend, spieler: [...kegelabend.spieler, newPlayer] });
  };

  /**
   * Removes a player from the table
   * @param {string} playerId - ID of the player to delete
   */
  const removePlayer = playerId => {
    const updatedSpieler = kegelabend.spieler.filter(p => p.id !== playerId);
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  // ============================================
  // CALCULATIONS
  // ============================================

  // Calculate grand total of all players (for the footer)
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
