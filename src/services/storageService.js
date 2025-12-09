/**
 * Storage Service for Kegelbuch
 * Handles saving/loading data to LocalStorage and JSON export/import
 */

const STORAGE_KEYS = {
  KEGELABENDE: 'kegelbuch_kegelabende',
  CONFIG: 'kegelbuch_config',
  SPIELER: 'kegelbuch_spieler',
};

/**
 * Save data to LocalStorage
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

/**
 * Load data from LocalStorage
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

/**
 * Save all Kegelabende
 */
export const saveKegelabende = kegelabende => {
  return saveToStorage(STORAGE_KEYS.KEGELABENDE, kegelabende);
};

/**
 * Load all Kegelabende
 */
export const loadKegelabende = () => {
  return loadFromStorage(STORAGE_KEYS.KEGELABENDE, []);
};

/**
 * Save config
 */
export const saveConfig = config => {
  return saveToStorage(STORAGE_KEYS.CONFIG, config);
};

/**
 * Load config
 */
export const loadConfig = defaultConfig => {
  return loadFromStorage(STORAGE_KEYS.CONFIG, defaultConfig);
};

/**
 * Save known players (for autocomplete)
 */
export const saveSpieler = spieler => {
  return saveToStorage(STORAGE_KEYS.SPIELER, spieler);
};

/**
 * Load known players
 */
export const loadSpieler = () => {
  return loadFromStorage(STORAGE_KEYS.SPIELER, []);
};

/**
 * Export all data as JSON file
 */
export const exportToJSON = () => {
  const data = {
    kegelabende: loadKegelabende(),
    config: loadFromStorage(STORAGE_KEYS.CONFIG),
    spieler: loadSpieler(),
    exportDatum: new Date().toISOString(),
    version: '1.0',
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kegelbuch_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import data from JSON file
 */
export const importFromJSON = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const data = JSON.parse(event.target.result);

        if (data.kegelabende) {
          saveKegelabende(data.kegelabende);
        }
        if (data.config) {
          saveConfig(data.config);
        }
        if (data.spieler) {
          saveSpieler(data.spieler);
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

/**
 * Clear all data (with confirmation)
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
