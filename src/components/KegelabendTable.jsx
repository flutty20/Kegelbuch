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

import React, { useState, useCallback, useMemo } from 'react';

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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Config
import { createEmptyPlayer } from '../config/defaultConfig';

/**
 * Calculates the total amount for a single player
 *
 * Formula: Entry Fee + Normal Penalties + Inverted Penalties from others
 *
 * Normal penalties: Player pays for their own penalties
 * Inverted penalties (Kranz, Volle): Player pays when OTHERS throw them
 *
 * @param {Object} player - The player with their penalties
 * @param {Object} config - The configuration with penalty prices
 * @param {Array} allPlayers - All players (needed for inverted penalties)
 * @returns {number} - Total amount in Euro
 */
const calculatePlayerTotal = (player, config, allPlayers) => {
  // Start with entry fee, then add all penalties
  return config.strafen.reduce((total, strafe) => {
    if (strafe.inverted) {
      // INVERTED: Sum up penalties from OTHER players
      const othersCount = allPlayers
        .filter(p => p.id !== player.id)
        .reduce((sum, p) => sum + (p.strafen[strafe.id] || 0), 0);
      return total + othersCount * strafe.preis;
    }
    // NORMAL: Player pays for their own penalties
    return total + (player.strafen[strafe.id] || 0) * strafe.preis;
  }, config.startgebuehr);
};

/**
 * Main component: The editable bowling evening table
 * 
 * @param {Object} kegelabend - Current bowling evening data
 * @param {Object} config - Configuration (penalties, fees)
 * @param {Function} onUpdate - Callback when evening data changes
 * @param {Array} savedPlayers - List of saved player names for quick-add
 * @param {Function} onAddSavedPlayer - Callback to add a new player to master list
 */
const KegelabendTable = ({ kegelabend, config, onUpdate, savedPlayers = [], onAddSavedPlayer }) => {
  // ============================================
  // STATE
  // ============================================
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const [newPlayerDialogOpen, setNewPlayerDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // ============================================
  // HELPER: Generic player update function
  // ============================================
  
  /**
   * Updates a specific player's data
   * @param {string} playerId - ID of the player
   * @param {Function} updateFn - Function that receives player and returns updated player
   */
  const updatePlayer = useCallback((playerId, updateFn) => {
    const updatedSpieler = kegelabend.spieler.map(player =>
      player.id === playerId ? updateFn(player) : player
    );
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  }, [kegelabend, onUpdate]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /** Updates a player field (e.g., name) */
  const handlePlayerChange = useCallback((playerId, field, value) => {
    updatePlayer(playerId, player => ({ ...player, [field]: value }));
  }, [updatePlayer]);

  /** Updates a penalty count */
  const handleStrafeChange = useCallback((playerId, strafeId, value) => {
    const numValue = parseInt(value, 10) || 0;
    updatePlayer(playerId, player => ({
      ...player,
      strafen: { ...player.strafen, [strafeId]: numValue },
    }));
  }, [updatePlayer]);

  /** Updates a game result */
  const handleSpielChange = useCallback((playerId, spielId, value) => {
    updatePlayer(playerId, player => ({
      ...player,
      spiele: { ...player.spiele, [spielId]: value },
    }));
  }, [updatePlayer]);

  /**
   * Opens the add player menu
   */
  const handleAddPlayerClick = (event) => {
    setAddMenuAnchor(event.currentTarget);
  };

  /** Adds a saved player to the current evening */
  const addSavedPlayer = useCallback((playerName) => {
    setAddMenuAnchor(null);
    if (kegelabend.spieler.some(p => p.name === playerName)) return;
    
    onUpdate({ 
      ...kegelabend, 
      spieler: [...kegelabend.spieler, createEmptyPlayer(playerName)] 
    });
  }, [kegelabend, onUpdate]);

  /** Opens dialog to create a new player */
  const handleNewPlayerClick = useCallback(() => {
    setAddMenuAnchor(null);
    setNewPlayerDialogOpen(true);
  }, []);

  /** Creates a new player and adds to both master list and current evening */
  const handleCreateNewPlayer = useCallback(() => {
    const name = newPlayerName.trim();
    if (!name) return;
    
    // Add to master list
    onAddSavedPlayer?.(name);
    
    // Add to current evening
    onUpdate({ 
      ...kegelabend, 
      spieler: [...kegelabend.spieler, createEmptyPlayer(name)] 
    });
    
    setNewPlayerName('');
    setNewPlayerDialogOpen(false);
  }, [newPlayerName, kegelabend, onUpdate, onAddSavedPlayer]);

  /** Removes a player from the table */
  const removePlayer = useCallback((playerId) => {
    onUpdate({ 
      ...kegelabend, 
      spieler: kegelabend.spieler.filter(p => p.id !== playerId) 
    });
  }, [kegelabend, onUpdate]);

  // ============================================
  // CALCULATIONS (memoized for performance)
  // ============================================

  const grandTotal = useMemo(() => 
    kegelabend.spieler.reduce((sum, player) => 
      sum + calculatePlayerTotal(player, config, kegelabend.spieler), 0
    ), [kegelabend.spieler, config]
  );

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 50 }} align="center">
                Nr.
              </TableCell>
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
              {config.spielarten.map((spiel, idx) => (
                <TableCell
                  key={spiel.id}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: 70,
                    // Visual separator before first game type
                    borderLeft: idx === 0 ? '3px solid rgba(255,255,255,0.5)' : undefined,
                  }}
                  align="center"
                >
                  <Tooltip title={spiel.description}>
                    <span>{spiel.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
              {/* Sum column with visual separator */}
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  width: 90,
                  borderLeft: '3px solid rgba(255,255,255,0.5)',
                  backgroundColor: 'primary.dark',
                }}
                align="right"
              >
                Summe
              </TableCell>
              <TableCell sx={{ color: 'white', width: 50 }} align="center">
                {/* Delete column */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kegelabend.spieler.map((player, index) => {
              const playerTotal = calculatePlayerTotal(player, config, kegelabend.spieler);
              return (
                <TableRow
                  key={player.id}
                  sx={{ backgroundColor: index % 2 === 0 ? 'grey.50' : 'white' }}
                >
                  {/* Row number */}
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                      {index + 1}
                    </Typography>
                  </TableCell>
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
                  {config.spielarten.map((spiel, idx) => (
                    <TableCell
                      key={spiel.id}
                      align="center"
                      sx={{
                        // Visual separator before first game type
                        borderLeft: idx === 0 ? '3px solid #e0e0e0' : undefined,
                      }}
                    >
                      <TextField
                        value={player.spiele[spiel.id] || ''}
                        onChange={e => handleSpielChange(player.id, spiel.id, e.target.value)}
                        variant="standard"
                        size="small"
                        inputProps={{ style: { textAlign: 'center', width: 40 } }}
                      />
                    </TableCell>
                  ))}
                  {/* Sum cell with visual separator and highlight */}
                  <TableCell
                    align="right"
                    sx={{
                      borderLeft: '3px solid #e0e0e0',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    }}
                  >
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
              {/* Spans: Nr + Name + Start + all penalties = 3 + strafen.length */}
              <TableCell colSpan={3 + config.strafen.length}>
                <IconButton onClick={handleAddPlayerClick} color="primary" size="small">
                  <AddIcon /> <Typography variant="body2">Spieler hinzufügen</Typography>
                </IconButton>
              </TableCell>
              {/* Empty cells for game types */}
              <TableCell
                colSpan={config.spielarten.length}
                sx={{ borderLeft: '3px solid #e0e0e0' }}
              />
              {/* Grand total directly under Sum column */}
              <TableCell
                align="right"
                sx={{
                  borderLeft: '3px solid #e0e0e0',
                  backgroundColor: 'primary.main',
                  color: 'white',
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {grandTotal.toFixed(2)}
                  {config.waehrung}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* ==========================================
          ADD PLAYER MENU
          ========================================== */}
      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
      >
        {/* Saved players */}
        {savedPlayers.length > 0 && (
          <>
            {savedPlayers.map(name => {
              const isInEvening = kegelabend.spieler.some(p => p.name === name);
              return (
                <MenuItem
                  key={name}
                  onClick={() => addSavedPlayer(name)}
                  disabled={isInEvening}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                  {isInEvening && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (bereits dabei)
                    </Typography>
                  )}
                </MenuItem>
              );
            })}
            <Divider />
          </>
        )}
        
        {/* Create new player option */}
        <MenuItem onClick={handleNewPlayerClick}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="primary">Neuer Spieler...</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* ==========================================
          NEW PLAYER DIALOG
          ========================================== */}
      <Dialog 
        open={newPlayerDialogOpen} 
        onClose={() => setNewPlayerDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Neuer Spieler</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateNewPlayer()}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Der Spieler wird zu den Stammdaten und zum aktuellen Abend hinzugefügt.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPlayerDialogOpen(false)}>Abbrechen</Button>
          <Button 
            onClick={handleCreateNewPlayer} 
            variant="contained"
            disabled={!newPlayerName.trim()}
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KegelabendTable;
