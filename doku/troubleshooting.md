# Troubleshooting — Häufige Probleme

1) Explorer/VS Code zeigt Dateien nicht an
- Lösung: Explorer aktualisieren (`View > Refresh`), oder VS Code neu laden (`Developer: Reload Window`). Prüfe außerdem, ob du das richtige Workspace‑Root geöffnet hast.

2) `npm ci` schlägt fehl
- Ursache: `npm ci` benötigt eine vorhandene `package-lock.json`. Verwende `npm install` um ein Lockfile zu erzeugen.

3) Qodana meldet viele Alarme
- Lösung: Erzeuge eine Baseline, um alte Probleme zu ignorieren; behebe kritische Probleme oder passe `fail-threshold` temporär an.

4) Auto‑Fixes werden nicht angewendet
- Lösung: Lokal `npm run lint:fix` ausführen; wenn CI nichts ändert, prüfe, ob `eslint`/`prettier` Konfigurationen vorhanden sind und ob Dateien durch `.gitignore` ausgeschlossen werden.

5) CI kann nicht pushen
- Ursache: fehlende `contents: write` Permission oder branch protection. Workflow wurde bereits auf `contents: write` gesetzt; falls Branch Protection Pushes blockiert, verwende PR‑Erstellung statt direktem Push (ich kann das anpassen).
