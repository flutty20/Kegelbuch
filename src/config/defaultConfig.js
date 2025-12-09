/**
 * defaultConfig.js - Default configuration for the Kegelbuch
 *
 * This file contains all configurable settings:
 * - Entry fee per player
 * - List of penalties with prices
 * - List of game types
 * - Currency setting
 *
 * NOTE: These values can later be adjusted by the user through a settings page.
 * Changes here are the default values for new installations.
 */

/**
 * Default configuration
 * Used on first app startup
 */
export const defaultConfig = {
  // ============================================
  // ENTRY FEE
  // ============================================

  // Entry fee each player pays per evening (in Euro)
  startgebuehr: 6.0,

  // ============================================
  // PENALTIES (Strafen)
  // ============================================

  // List of all possible penalties
  // Each penalty has:
  // - id: Unique identifier (for database)
  // - label: Short name (displayed in table)
  // - description: Description (shown as tooltip)
  // - preis: Cost per penalty in Euro
  // - inverted: If true, ALL OTHER players pay when this is thrown (e.g., Kranz, Volle)
  strafen: [
    { id: 'kalle', label: 'Kalle', description: 'Ball ins Aus', preis: 0.5 },
    { id: 'stina', label: 'Stina', description: 'Mittlere 3 Pins', preis: 0.5 },
    { id: 'verspaetung', label: 'Verspätung', description: 'Zu spät gekommen', preis: 1.0 },
    { id: 'verloren', label: 'Spiel verloren', description: 'Verlorenes Spiel', preis: 0.5 },
    { id: 'kranz', label: 'Kranz', description: 'Kranz geworfen - alle anderen zahlen', preis: 0.5, inverted: true },
    { id: 'volle', label: 'Volle', description: 'Volle geworfen - alle anderen zahlen', preis: 0.5, inverted: true },
  ],

  // ============================================
  // GAME TYPES (Spielarten)
  // ============================================

  // List of game types/competitions
  // Each game type has:
  // - id: Unique identifier
  // - label: Short name (displayed in table)
  // - description: Full name (shown as tooltip)
  spielarten: [
    { id: 'wm', label: 'WM', description: 'Wachtberg Meisterschaft' },
    { id: 'gs', label: 'GS', description: 'Geldspiel' },
  ],

  // ============================================
  // MISC
  // ============================================

  // Currency symbol for display
  waehrung: '€',
};

/**
 * Creates a new, empty player
 *
 * Used when "Add Player" is clicked
 *
 * @param {string} name - Optional: Pre-filled name
 * @returns {Object} - New player object
 */
export const createEmptyPlayer = (name = '') => ({
  id: crypto.randomUUID(), // Generate unique ID
  name, // Name (empty or provided)
  anwesend: true, // Present by default
  strafen: {}, // Empty object for penalties {penaltyId: count}
  spiele: {}, // Empty object for game results {gameId: result}
});

/**
 * Creates a new, empty bowling evening
 *
 * Used when "New Evening" is clicked
 *
 * @param {string} datum - Optional: Date in format 'YYYY-MM-DD'
 *                         Default: Today's date
 * @returns {Object} - New bowling evening object
 */
export const createEmptyKegelabend = (datum = new Date().toISOString().split('T')[0]) => ({
  id: crypto.randomUUID(), // Unique ID
  datum, // Date of the bowling evening
  spieler: [], // Empty player list
  notizen: '', // Optional notes
  abgeschlossen: false, // Not yet completed
});
