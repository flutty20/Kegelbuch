/**
 * storageService.js - Datenspeicherung für das Kegelbuch
 *
 * Dieser Service kümmert sich um:
 * - Speichern und Laden von Daten in/aus dem Browser (LocalStorage)
 * - Export aller Daten als JSON-Datei (für Backups)
 * - Import von JSON-Dateien (für Wiederherstellung)
 *
 * HINWEIS: LocalStorage speichert Daten nur im aktuellen Browser!
 * Für Datensicherung sollte regelmäßig ein JSON-Export gemacht werden.
 *
 * Datenlimit: LocalStorage hat ca. 5-10 MB Speicher (je nach Browser).
 * Das reicht für viele hundert Kegelabende.
 */

// ============================================
// STORAGE KEYS - Schlüssel für LocalStorage
// ============================================

/**
 * Die Schlüssel unter denen die Daten im LocalStorage gespeichert werden.
 * Alle beginnen mit 'kegelbuch_' um Konflikte mit anderen Apps zu vermeiden.
 */
const STORAGE_KEYS = {
  KEGELABENDE: 'kegelbuch_kegelabende', // Alle Kegelabende
  CONFIG: 'kegelbuch_config', // Konfiguration (Strafen, Gebühren)
  SPIELER: 'kegelbuch_spieler', // Bekannte Spieler (für Autocomplete, später)
};

// ============================================
// BASIS-FUNKTIONEN
// ============================================

/**
 * Speichert beliebige Daten im LocalStorage
 *
 * @param {string} key - Der Speicher-Schlüssel
 * @param {any} data - Die zu speichernden Daten (werden zu JSON konvertiert)
 * @returns {boolean} - true wenn erfolgreich, false bei Fehler
 */
export const saveToStorage = (key, data) => {
  try {
    // Daten zu JSON-String konvertieren und speichern
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    // Fehler kann auftreten wenn LocalStorage voll ist
    console.error('Fehler beim Speichern:', error);
    return false;
  }
};

/**
 * Lädt Daten aus dem LocalStorage
 *
 * @param {string} key - Der Speicher-Schlüssel
 * @param {any} defaultValue - Wird zurückgegeben wenn nichts gespeichert ist
 * @returns {any} - Die geladenen Daten oder der Standardwert
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    // Wenn Daten existieren: JSON parsen, sonst Standardwert
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    return defaultValue;
  }
};

// ============================================
// KEGELABENDE - Speichern/Laden
// ============================================

/**
 * Speichert alle Kegelabende
 * @param {Array} kegelabende - Array aller Kegelabend-Objekte
 */
export const saveKegelabende = kegelabende => {
  return saveToStorage(STORAGE_KEYS.KEGELABENDE, kegelabende);
};

/**
 * Lädt alle gespeicherten Kegelabende
 * @returns {Array} - Array aller Kegelabende (oder leeres Array)
 */
export const loadKegelabende = () => {
  return loadFromStorage(STORAGE_KEYS.KEGELABENDE, []);
};

// ============================================
// KONFIGURATION - Speichern/Laden
// ============================================

/**
 * Speichert die Konfiguration (Strafen, Gebühren, etc.)
 * @param {Object} config - Das Konfigurations-Objekt
 */
export const saveConfig = config => {
  return saveToStorage(STORAGE_KEYS.CONFIG, config);
};

/**
 * Lädt die gespeicherte Konfiguration
 * @param {Object} defaultConfig - Standardwerte falls nichts gespeichert ist
 * @returns {Object} - Die Konfiguration
 */
export const loadConfig = defaultConfig => {
  return loadFromStorage(STORAGE_KEYS.CONFIG, defaultConfig);
};

// ============================================
// SPIELER-STAMMDATEN - Für spätere Features
// ============================================

/**
 * Speichert bekannte Spieler (für Autocomplete-Feature)
 * @param {Array} spieler - Array von Spieler-Objekten
 */
export const saveSpieler = spieler => {
  return saveToStorage(STORAGE_KEYS.SPIELER, spieler);
};

/**
 * Lädt bekannte Spieler
 * @returns {Array} - Array von Spielern (oder leeres Array)
 */
export const loadSpieler = () => {
  return loadFromStorage(STORAGE_KEYS.SPIELER, []);
};

// ============================================
// JSON EXPORT - Backup erstellen
// ============================================

/**
 * Exportiert ALLE Daten als JSON-Datei zum Download
 *
 * Erstellt eine Datei mit Namen: kegelbuch_export_YYYY-MM-DD.json
 * Die Datei enthält:
 * - Alle Kegelabende
 * - Die Konfiguration
 * - Bekannte Spieler
 * - Export-Datum und Version
 *
 * Diese Datei kann später wieder importiert werden.
 */
export const exportToJSON = () => {
  // Alle Daten zusammensammeln
  const data = {
    kegelabende: loadKegelabende(),
    config: loadFromStorage(STORAGE_KEYS.CONFIG),
    spieler: loadSpieler(),
    exportDatum: new Date().toISOString(), // Wann wurde exportiert?
    version: '1.0', // Datenformat-Version (für zukünftige Kompatibilität)
  };

  // JSON-String erstellen (mit Einrückung für Lesbarkeit)
  const jsonString = JSON.stringify(data, null, 2);

  // Blob (Binary Large Object) erstellen
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Download-URL erstellen
  const url = URL.createObjectURL(blob);

  // Unsichtbaren Link erstellen und klicken (startet Download)
  const link = document.createElement('a');
  link.href = url;
  link.download = `kegelbuch_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();

  // Aufräumen
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// JSON IMPORT - Backup wiederherstellen
// ============================================

/**
 * Importiert Daten aus einer JSON-Datei
 *
 * ACHTUNG: Überschreibt alle vorhandenen Daten!
 *
 * @param {File} file - Die JSON-Datei vom File-Input
 * @returns {Promise} - Resolved mit den importierten Daten
 */
export const importFromJSON = file => {
  return new Promise((resolve, reject) => {
    // FileReader zum Lesen der Datei
    const reader = new FileReader();

    // Wenn Datei gelesen wurde...
    reader.onload = event => {
      try {
        // JSON parsen
        const data = JSON.parse(event.target.result);

        // Daten in LocalStorage speichern (wenn vorhanden)
        if (data.kegelabende) {
          saveKegelabende(data.kegelabende);
        }
        if (data.config) {
          saveConfig(data.config);
        }
        if (data.spieler) {
          saveSpieler(data.spieler);
        }

        // Erfolg! Daten zurückgeben
        resolve(data);
      } catch (error) {
        // Ungültiges JSON
        reject(new Error('Ungültige JSON-Datei'));
      }
    };

    // Bei Lesefehler
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));

    // Datei als Text lesen (startet den Prozess)
    reader.readAsText(file);
  });
};

// ============================================
// DATEN LÖSCHEN
// ============================================

/**
 * Löscht ALLE gespeicherten Daten
 *
 * ACHTUNG: Diese Funktion löscht unwiderruflich alle Daten!
 * Sollte nur mit Bestätigung des Benutzers aufgerufen werden.
 */
export const clearAllData = () => {
  // Jeden Storage-Key einzeln löschen
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
