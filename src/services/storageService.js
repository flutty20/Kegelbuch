/**
 * storageService.js - Data storage for the Kegelbuch
 *
 * This service handles:
 * - Saving and loading data to/from browser (LocalStorage)
 * - Exporting all data as JSON file (for backups)
 * - Importing JSON files (for restoration)
 *
 * NOTE: LocalStorage only stores data in the current browser!
 * For data safety, regular JSON exports should be made.
 *
 * Storage limit: LocalStorage has ~5-10 MB storage (varies by browser).
 * This is enough for many hundreds of bowling evenings.
 */

// ============================================
// STORAGE KEYS - Keys for LocalStorage
// ============================================

/**
 * The keys under which data is stored in LocalStorage.
 * All start with 'kegelbuch_' to avoid conflicts with other apps.
 */
const STORAGE_KEYS = {
  KEGELABENDE: 'kegelbuch_kegelabende', // All bowling evenings
  CONFIG: 'kegelbuch_config', // Configuration (penalties, fees)
  SPIELER: 'kegelbuch_spieler', // Known players (for autocomplete, later)
};

// ============================================
// BASE FUNCTIONS
// ============================================

/**
 * Saves any data to LocalStorage
 *
 * @param {string} key - The storage key
 * @param {any} data - The data to save (will be converted to JSON)
 * @returns {boolean} - true if successful, false on error
 */
export const saveToStorage = (key, data) => {
  try {
    // Convert data to JSON string and save
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    // Error can occur if LocalStorage is full
    console.error('Error saving to storage:', error);
    return false;
  }
};

/**
 * Loads data from LocalStorage
 *
 * @param {string} key - The storage key
 * @param {any} defaultValue - Returned if nothing is saved
 * @returns {any} - The loaded data or default value
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    // If data exists: parse JSON, otherwise return default
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

// ============================================
// BOWLING EVENINGS (Kegelabende) - Save/Load
// ============================================

/**
 * Saves all bowling evenings
 * @param {Array} kegelabende - Array of all bowling evening objects
 */
export const saveKegelabende = kegelabende => {
  return saveToStorage(STORAGE_KEYS.KEGELABENDE, kegelabende);
};

/**
 * Loads all saved bowling evenings
 * @returns {Array} - Array of all evenings (or empty array)
 */
export const loadKegelabende = () => {
  return loadFromStorage(STORAGE_KEYS.KEGELABENDE, []);
};

// ============================================
// CONFIGURATION - Save/Load
// ============================================

/**
 * Saves the configuration (penalties, fees, etc.)
 * @param {Object} config - The configuration object
 */
export const saveConfig = config => {
  return saveToStorage(STORAGE_KEYS.CONFIG, config);
};

/**
 * Loads the saved configuration
 * @param {Object} defaultConfig - Default values if nothing is saved
 * @returns {Object} - The configuration
 */
export const loadConfig = defaultConfig => {
  return loadFromStorage(STORAGE_KEYS.CONFIG, defaultConfig);
};

// ============================================
// PLAYER MASTER DATA - For future features
// ============================================

/**
 * Saves known players (for autocomplete feature)
 * @param {Array} spieler - Array of player objects
 */
export const saveSpieler = spieler => {
  return saveToStorage(STORAGE_KEYS.SPIELER, spieler);
};

/**
 * Loads known players
 * @returns {Array} - Array of players (or empty array)
 */
export const loadSpieler = () => {
  return loadFromStorage(STORAGE_KEYS.SPIELER, []);
};

// ============================================
// JSON EXPORT - Create backup
// ============================================

/**
 * Exports ALL data as JSON file for download
 *
 * Creates a file named: kegelbuch_export_YYYY-MM-DD.json
 * The file contains:
 * - All bowling evenings
 * - The configuration
 * - Known players
 * - Export date and version
 *
 * This file can be imported again later.
 */
export const exportToJSON = () => {
  // Gather all data
  const data = {
    kegelabende: loadKegelabende(),
    config: loadFromStorage(STORAGE_KEYS.CONFIG),
    spieler: loadSpieler(),
    exportDatum: new Date().toISOString(), // When was it exported?
    version: '1.0', // Data format version (for future compatibility)
  };

  // Create JSON string (with indentation for readability)
  const jsonString = JSON.stringify(data, null, 2);

  // Create Blob (Binary Large Object)
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create download URL
  const url = URL.createObjectURL(blob);

  // Create invisible link and click it (starts download)
  const link = document.createElement('a');
  link.href = url;
  link.download = `kegelbuch_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// JSON IMPORT - Restore backup
// ============================================

/**
 * Imports data from a JSON file
 *
 * WARNING: Overwrites all existing data!
 *
 * @param {File} file - The JSON file from file input
 * @returns {Promise} - Resolves with the imported data
 */
export const importFromJSON = file => {
  return new Promise((resolve, reject) => {
    // FileReader for reading the file
    const reader = new FileReader();

    // When file is read...
    reader.onload = event => {
      try {
        // Parse JSON
        const data = JSON.parse(event.target.result);

        // Save data to LocalStorage (if present)
        if (data.kegelabende) {
          saveKegelabende(data.kegelabende);
        }
        if (data.config) {
          saveConfig(data.config);
        }
        if (data.spieler) {
          saveSpieler(data.spieler);
        }

        // Success! Return data
        resolve(data);
      } catch (error) {
        // Invalid JSON
        reject(new Error('Invalid JSON file'));
      }
    };

    // On read error
    reader.onerror = () => reject(new Error('Error reading file'));

    // Read file as text (starts the process)
    reader.readAsText(file);
  });
};

// ============================================
// DELETE DATA
// ============================================

/**
 * Deletes ALL saved data
 *
 * WARNING: This function permanently deletes all data!
 * Should only be called with user confirmation.
 */
export const clearAllData = () => {
  // Delete each storage key individually
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
