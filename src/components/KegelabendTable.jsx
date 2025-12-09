import React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

/**
 * Calculate total for a single player
 */
const calculatePlayerTotal = (player, config) => {
  let total = config.startgebuehr;

  // Add penalties
  config.strafen.forEach(strafe => {
    const count = player.strafen[strafe.id] || 0;
    total += count * strafe.preis;
  });

  return total;
};

/**
 * Kegelabend Table Component
 * Displays the bowling evening as an editable table
 */
const KegelabendTable = ({ kegelabend, config, onUpdate }) => {
  const handlePlayerChange = (playerId, field, value) => {
    const updatedSpieler = kegelabend.spieler.map(player => {
      if (player.id === playerId) {
        return { ...player, [field]: value };
      }
      return player;
    });
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  const handleStrafeChange = (playerId, strafeId, value) => {
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

  const addPlayer = () => {
    const newPlayer = {
      id: crypto.randomUUID(),
      name: '',
      anwesend: true,
      strafen: {},
      spiele: {},
    };
    onUpdate({ ...kegelabend, spieler: [...kegelabend.spieler, newPlayer] });
  };

  const removePlayer = playerId => {
    const updatedSpieler = kegelabend.spieler.filter(p => p.id !== playerId);
    onUpdate({ ...kegelabend, spieler: updatedSpieler });
  };

  // Calculate grand total
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
