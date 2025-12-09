# 📋 Kegelbuch — Feature-Liste

Übersicht aller geplanten Features und deren Status.

---

## Phase 1: Grundfunktionen ✅

Die Basis-App zum Ersetzen des physischen Kegelbuchs.

- [x] **Kegelabend-Tabelle** — Tabellenansicht wie im echten Kegelbuch
- [x] **Spieler verwalten** — Hinzufügen, entfernen
- [x] **Namen eingeben** — Pro Spieler
- [x] **Startgebühr** — 6€ (konfigurierbar)
- [x] **Strafen eintragen**
  - [x] Kalle (Ball ins Aus)
  - [x] Stina (Mittlere 3 Pins)
  - [x] Verspätung
  - [x] Verlorenes Spiel
  - [x] Kranz (alle anderen zahlen)
  - [x] Volle (alle anderen zahlen)
- [x] **Spielergebnisse eintragen**
  - [x] WM (Wachtberg Meisterschaft)
  - [x] GS (Geldspiel)
- [x] **Automatische Summenberechnung** — Pro Spieler und Gesamt
- [x] **Speichern** — LocalStorage
- [x] **JSON Export/Import** — Datensicherung

---

## Phase 2: PDF & Druck 🔄

- [ ] **PDF-Export** — Kegelabend als PDF exportieren
- [ ] **Druckansicht** — Optimierte Ansicht für Drucker

---

## Phase 3: Konfiguration ✅

- [x] **Einstellungen-Menü** — Dropdown oben rechts mit ⚙️ Icon
- [x] **Strafen konfigurieren** — Neue Strafen hinzufügen, Preise ändern, löschen
- [x] **Invertierte Strafen** — Checkbox "Andere zahlen" (wie Kranz/Volle)
- [x] **Startgebühr anpassen** — Über UI änderbar
- [ ] **Spielarten konfigurieren** — WM, GS, weitere hinzufügen (noch offen)

---

## Phase 4: Spielerverwaltung ✅

- [x] **Spieler-Stammdaten** — Namen speichern und verwalten
- [x] **Spieler-Auswahl** — Dropdown beim Hinzufügen mit allen gespeicherten Spielern
- [x] **Neuer Spieler** — Direkt anlegen und zu Stammdaten + Abend hinzufügen
- [ ] **Erweiterte Daten** — Telefonnummer, etc. (noch offen)

---

## Phase 5: Abrechnung ⏳

- [ ] **Wer zahlt wie viel?** — Automatische Berechnung am Ende des Abends
- [ ] **Kassenstand** — Wer hat bezahlt, wer schuldet noch
- [ ] **Gesamtübersicht** — Alle Abende auf einen Blick

---

## Phase 6: Statistiken ⏳

- [ ] **Meiste Strafen** — Wer hat am meisten Kallen/Stinas?
- [ ] **Meiste Zahlungen** — Wer hat insgesamt am meisten bezahlt?
- [ ] **Beste Ergebnisse** — Höchste WM-Punkte, etc.
- [ ] **Trend-Anzeige** — Entwicklung über Zeit
- [ ] **Diagramme** — Visuelle Darstellung

---

## Phase 7: Multi-User (Optional) ⏳

- [ ] **Webseite online** — Gehostet auf GitHub Pages ✅
- [ ] **Eigene Einträge** — Jeder kann selbst eintragen
- [ ] **Backend** — Zentrale Datenspeicherung (Firebase o.ä.)
- [ ] **Login** — Spieler-Accounts

---

## Optionale Erweiterungen 💡

Sinnvolle Features für die Zukunft.

### UX-Verbesserungen
- [ ] **Dark Mode** — Dunkles Design für Abendnutzung
- [ ] **Responsive Design** — Optimiert für Smartphone/Tablet
- [ ] **Undo/Redo** — Änderungen rückgängig machen
- [ ] **Keyboard Shortcuts** — Schnelle Eingabe mit Tastatur
- [ ] **Drag & Drop** — Spieler-Reihenfolge ändern

### Daten & Archiv
- [ ] **Kegelabend löschen** — Mit Bestätigung
- [ ] **Kegelabend duplizieren** — Schnell neuen Abend mit gleichen Spielern
- [ ] **Saison-Übersicht** — Gruppierung nach Jahr/Saison
- [ ] **Archiv-Modus** — Alte Abende als "abgeschlossen" markieren
- [ ] **Daten-Reset** — Alle Daten löschen (mit doppelter Bestätigung)

### Erweiterte Berechnungen
- [ ] **Gewinner/Verlierer** — Automatische Ermittlung pro Abend
- [ ] **Rundungsoption** — Beträge auf 10 Cent runden
- [ ] **Differenz anzeigen** — Wer zahlt/bekommt wie viel mehr/weniger als Durchschnitt

### Teilen & Export
- [ ] **QR-Code** — Schnell Daten teilen zwischen Geräten
- [ ] **WhatsApp-Nachricht** — Ergebnis als Text formatiert
- [ ] **Excel-Export** — CSV/XLSX für Tabellenkalkulation
- [ ] **Backup-Erinnerung** — Hinweis wenn lange kein Export gemacht wurde

### Gamification
- [ ] **Achievements** — Lustige Erfolge (z.B. "10x Kalle in einem Abend")
- [ ] **Rekorde** — Höchste Summe, meiste Strafen, etc.
- [ ] **Spitznamen** — Für Spieler mit besonderen Leistungen

### Technisch
- [ ] **PWA** — Als App installierbar (offline-fähig)
- [ ] **Service Worker** — Offline-Nutzung
- [ ] **IndexedDB** — Größerer Speicher statt LocalStorage
- [ ] **Automatische Updates** — Hinweis bei neuer Version

---

## Legende

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Abgeschlossen |
| 🔄 | In Arbeit |
| ⏳ | Geplant |
| 💡 | Optional/Nice-to-have |
| ❌ | Abgelehnt/Entfernt |

---

*Zuletzt aktualisiert: 09.12.2025*
