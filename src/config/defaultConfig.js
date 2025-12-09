/**
 * defaultConfig.js - Standardkonfiguration für das Kegelbuch
 *
 * Diese Datei enthält alle konfigurierbaren Einstellungen:
 * - Startgebühr pro Spieler
 * - Liste der Strafen mit Preisen
 * - Liste der Spielarten
 * - Währungseinstellung
 *
 * WICHTIG: Diese Werte können später über eine Einstellungs-Seite
 * vom Benutzer angepasst werden. Änderungen hier sind die Standardwerte
 * für neue Installationen.
 */

/**
 * Standard-Konfiguration
 * Wird beim ersten Start der App verwendet
 */
export const defaultConfig = {
  // ============================================
  // GRUNDGEBÜHR
  // ============================================

  // Startgebühr die jeder Spieler pro Abend zahlt (in Euro)
  startgebuehr: 6.0,

  // ============================================
  // STRAFEN
  // ============================================

  // Liste aller möglichen Strafen
  // Jede Strafe hat:
  // - id: Eindeutiger Bezeichner (für die Datenbank)
  // - label: Kurzname (wird in der Tabelle angezeigt)
  // - description: Beschreibung (wird als Tooltip angezeigt)
  // - preis: Kosten pro Strafe in Euro
  strafen: [
    { id: 'kalle', label: 'Kalle', description: 'Ball ins Aus', preis: 0.5 },
    { id: 'stina', label: 'Stina', description: 'Mittlere 3 Pins', preis: 0.5 },
    { id: 'verspaetung', label: 'Verspätung', description: 'Zu spät gekommen', preis: 1.0 },
    { id: 'verloren', label: 'Spiel verloren', description: 'Verlorenes Spiel', preis: 0.5 },
  ],

  // ============================================
  // SPIELARTEN
  // ============================================

  // Liste der Spielarten/Wettbewerbe
  // Jede Spielart hat:
  // - id: Eindeutiger Bezeichner
  // - label: Kurzname (wird in der Tabelle angezeigt)
  // - description: Voller Name (wird als Tooltip angezeigt)
  spielarten: [
    { id: 'wm', label: 'WM', description: 'Wachtberg Meisterschaft' },
    { id: 'gs', label: 'GS', description: 'Geldspiel' },
  ],

  // ============================================
  // SONSTIGES
  // ============================================

  // Währungssymbol für die Anzeige
  waehrung: '€',
};

/**
 * Erstellt einen neuen, leeren Spieler
 *
 * Wird verwendet wenn "Spieler hinzufügen" geklickt wird
 *
 * @param {string} name - Optional: Vorausgefüllter Name
 * @returns {Object} - Neues Spieler-Objekt
 */
export const createEmptyPlayer = (name = '') => ({
  id: crypto.randomUUID(), // Eindeutige ID generieren
  name, // Name (leer oder vorgegeben)
  anwesend: true, // Standardmäßig anwesend
  strafen: {}, // Leeres Objekt für Strafen {strafeId: anzahl}
  spiele: {}, // Leeres Objekt für Spielergebnisse {spielId: ergebnis}
});

/**
 * Erstellt einen neuen, leeren Kegelabend
 *
 * Wird verwendet wenn "Neuer Abend" geklickt wird
 *
 * @param {string} datum - Optional: Datum im Format 'YYYY-MM-DD'
 *                         Standard: Heutiges Datum
 * @returns {Object} - Neues Kegelabend-Objekt
 */
export const createEmptyKegelabend = (datum = new Date().toISOString().split('T')[0]) => ({
  id: crypto.randomUUID(), // Eindeutige ID
  datum, // Datum des Kegelabends
  spieler: [], // Leere Spielerliste
  notizen: '', // Optionale Notizen
  abgeschlossen: false, // Noch nicht abgeschlossen
});
