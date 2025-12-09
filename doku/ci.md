# CI/CD (GitHub Actions)

Workflow: `.github/workflows/pages.yml`

Wesentliche Schritte (Build‑Job):

- `actions/checkout@v4` (mit `fetch-depth: 0`) — holt den kompletten Branch.
- Setup Node.js (`actions/setup-node@v4`) und `npm install`.
- Auto‑Fixes: `npm run format` (Prettier) und `npm run lint:fix` (ESLint `--fix`).
- Commit & Push: Falls Auto‑Fixes Änderungen erzeugen, werden diese automatisch committet und auf den aktuellen Branch gepusht. Commit‑Message enthält `[skip ci]`, um wiederholte CI‑Runs zu vermeiden.
- Qodana: Ausführung via `jetbrains/qodana-action/analyze@...` mit `image: jetbrains/qodana-js:2024.3`. Ergebnisse werden nach `qodana-results` geschrieben und als Artifact `qodana-report` hochgeladen.
- Build: `npm run build` und Upload der `dist/` als Pages‑Artifact (`actions/upload-pages-artifact@v1`).
- Deploy‑Job: `actions/deploy-pages@v2` deployed die hochgeladene `dist/` nach GitHub Pages.

Wichtige Hinweise:
- Der Workflow ist aktuell so konfiguriert, dass Auto‑Fixes direkt auf `main` gepusht werden. Empfehlung: aktiviere Branch‑Protection oder ändere das Verhalten, sodass stattdessen ein Pull Request erstellt wird (siehe `autofix.md`).
- Permissions: `contents: write` ist gesetzt, damit der Workflow committen/pushen darf.
