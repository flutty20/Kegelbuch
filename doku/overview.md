# Projektübersicht

Dieses Repository enthält ein kleines Vite + React Projekt mit einer CI/CD‑Pipeline, die die Seite auf GitHub Pages deployed. Zusätzlich ist Qodana zur statischen Code‑Analyse integriert, sowie lokale und CI‑gestützte automatische Fixes (Prettier + ESLint).

Projektstruktur (wichtigste Dateien):

- `index.html` — HTML Entry
- `src/` — React Quellcode (`main.jsx`, `App.jsx`)
- `package.json` — Skripte & Abhängigkeiten
- `vite.config.js` — Vite Konfiguration
- `.github/workflows/pages.yml` — CI/CD Pipeline (Build + Qodana + Deploy)
- `.qodana.yaml` — Qodana Runner Konfiguration
- `.eslintrc.cjs`, `.prettierrc` — Linter / Formatter Konfigurationen

Ziel: moderne Dev‑Experience mit automatischer Code‑Qualitätssicherung und einfachem Deployment.
