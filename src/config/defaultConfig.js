/**
 * Default configuration for the Kegelbuch app
 * All values can be adjusted by the user later
 */

export const defaultConfig = {
  // Entry fee per player per evening
  startgebuehr: 6.0,

  // Penalties (Strafen) - name, label, price per occurrence
  strafen: [
    { id: 'kalle', label: 'Kalle', description: 'Ball ins Aus', preis: 0.5 },
    { id: 'stina', label: 'Stina', description: 'Mittlere 3 Pins', preis: 0.5 },
    { id: 'verspaetung', label: 'Verspätung', description: 'Zu spät gekommen', preis: 1.0 },
    { id: 'verloren', label: 'Spiel verloren', description: 'Verlorenes Spiel', preis: 0.5 },
  ],

  // Game types (Spielarten)
  spielarten: [
    { id: 'wm', label: 'WM', description: 'Wachtberg Meisterschaft' },
    { id: 'gs', label: 'GS', description: 'Geldspiel' },
  ],

  // Currency settings
  waehrung: '€',
};

/**
 * Creates an empty player entry
 */
export const createEmptyPlayer = (name = '') => ({
  id: crypto.randomUUID(),
  name,
  anwesend: true,
  strafen: {},
  spiele: {},
});

/**
 * Creates an empty Kegelabend
 */
export const createEmptyKegelabend = (datum = new Date().toISOString().split('T')[0]) => ({
  id: crypto.randomUUID(),
  datum,
  spieler: [],
  notizen: '',
  abgeschlossen: false,
});
