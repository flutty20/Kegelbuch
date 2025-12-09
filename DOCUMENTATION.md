# 📚 Kegelbuch — Technische Dokumentation

Komplette technische Dokumentation für das Kegelbuch-Projekt.

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Technologie-Stack](#2-technologie-stack)
3. [Projektstruktur](#3-projektstruktur)
4. [CI/CD Pipeline](#4-cicd-pipeline)
5. [Qodana Code-Analyse](#5-qodana-code-analyse)
6. [Auto-Fix & Linting](#6-auto-fix--linting)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Projektübersicht

Das Kegelbuch ist eine moderne Web-Applikation zur digitalen Verwaltung von Kegelabenden, Spielern und Ergebnissen.

### Architektur

```
┌─────────────────────────────────────────┐
│                index.html               │
│                    │                    │
│              ┌─────▼─────┐              │
│              │  main.jsx │              │
│              └─────┬─────┘              │
│                    │                    │
│         ┌──────────▼──────────┐         │
│         │   ThemeProvider     │         │
│         │   CacheProvider     │         │
│         └──────────┬──────────┘         │
│                    │                    │
│              ┌─────▼─────┐              │
│              │  App.jsx  │              │
│              └───────────┘              │
└─────────────────────────────────────────┘
```

### Build-Prozess

```
Source Files (.jsx, .js)  →  Vite (esbuild)  →  dist/  →  GitHub Pages
```

---

## 2. Technologie-Stack

| Bereich | Technologie | Version |
|---------|-------------|---------|
| Frontend Framework | React | 18.2 |
| Build Tool | Vite | 5.x |
| UI Components | Material-UI (MUI) | 7.x |
| CSS-in-JS | Emotion | 11.x |
| Linting | ESLint | 8.x |
| Formatting | Prettier | 2.x |
| Code Analysis | Qodana | 2024.3 |
| Runtime | Node.js | 18+ |

### Dependencies

**Production:**
- `react`, `react-dom` — UI Framework
- `@mui/material`, `@mui/icons-material` — UI Komponenten
- `@emotion/react`, `@emotion/styled`, `@emotion/cache` — Styling

**Development:**
- `vite`, `@vitejs/plugin-react` — Build Tool
- `eslint`, `eslint-plugin-react` — Linting
- `prettier` — Formatting

---

## 3. Projektstruktur

```
Kegelbuch/
├── .github/workflows/
│   ├── pages.yml              # Build & Deploy Pipeline
│   └── qodana.yml             # Code-Analyse Pipeline
├── src/
│   ├── App.jsx                # Haupt-React-Komponente
│   ├── main.jsx               # React Entry Point
│   └── theme.js               # MUI Theme Definition
├── index.html                 # HTML Entry Point
├── package.json               # Dependencies & Scripts
├── vite.config.js             # Vite Build-Konfiguration
├── .eslintrc.cjs              # ESLint Regeln
├── .prettierrc                # Prettier Konfiguration
├── .qodana.yaml               # Qodana Konfiguration
├── .gitignore                 # Ignorierte Dateien
├── README.md                  # Projektübersicht
└── DOCUMENTATION.md           # Diese Datei
```

---

## 4. CI/CD Pipeline

Das Projekt nutzt zwei GitHub Actions Workflows.

### 4.1 Deploy Workflow (`pages.yml`)

**Trigger:** Push auf `main`, manuell

| Schritt | Beschreibung |
|---------|--------------|
| Checkout | Repository auschecken |
| Setup Node | Node.js 18 einrichten |
| Install | `npm ci` |
| Build | `npm run build` |
| Deploy | GitHub Pages |

**Live-URL:** [https://flutty20.github.io/Kegelbuch/](https://flutty20.github.io/Kegelbuch/)

### 4.2 Qodana Workflow (`qodana.yml`)

**Trigger:** Push/PR auf `main`, manuell

| Schritt | Beschreibung |
|---------|--------------|
| Checkout | Repository mit History |
| Setup Node | Node.js 18 einrichten |
| Install | `npm ci` |
| Scan | Qodana Code-Analyse |

**Ergebnisse:** [qodana.cloud](https://qodana.cloud)

### Workflow manuell starten

1. **Actions** → Workflow wählen → **Run workflow**

---

## 5. Qodana Code-Analyse

### Konfiguration (`.qodana.yaml`)

```yaml
image: jetbrains/qodana-js:2024.3
project-dir: .
output-path: qodana-results

profile:
  name: Default

exclude:
  - node_modules
  - .git
  - dist

tools:
  eslint:
    enabled: true
    config: .eslintrc.cjs

cache:
  enabled: true
```

### Token einrichten

1. Projekt auf [qodana.cloud](https://qodana.cloud) erstellen
2. Project Token kopieren
3. GitHub Secret anlegen:
   - **Settings** → **Secrets and variables** → **Actions**
   - Name: `QODANA_TOKEN_1646119969`
   - Value: *Token einfügen*

### Lokal ausführen

```bash
docker run --rm -it \
  -v $(pwd):/data/project \
  -v $(pwd)/qodana-results:/data/results \
  jetbrains/qodana-js:2024.3
```

### Baseline erstellen

Um nur neue Probleme zu melden:

```yaml
# In .qodana.yaml hinzufügen
baseline: qodana.sarif.json
```

---

## 6. Auto-Fix & Linting

### Verfügbare Befehle

| Befehl | Tool | Beschreibung |
|--------|------|--------------|
| `npm run lint` | ESLint | Code prüfen |
| `npm run lint:fix` | ESLint | Fehler automatisch beheben |
| `npm run format` | Prettier | Code formatieren |

### Prettier Konfiguration (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### ESLint Konfiguration (`.eslintrc.cjs`)

```javascript
module.exports = {
  env: { browser: true, es2021: true, node: true },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  ignorePatterns: ['dist/', 'node_modules/', '*.min.js'],
  settings: { react: { version: 'detect' } },
};
```

### IDE-Integration

**VS Code** — Extensions installieren:
- Prettier - Code formatter
- ESLint

**Einstellungen** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## 7. Troubleshooting

### Installation

| Problem | Lösung |
|---------|--------|
| `npm ci` schlägt fehl | `npm install` ausführen |
| Module nicht gefunden | `npm install` neu ausführen |

### Build

| Problem | Lösung |
|---------|--------|
| terser not found | `minify: 'esbuild'` in vite.config.js |
| 404 auf GitHub Pages | `base` Pfad in vite.config.js prüfen |
| Port 5173 belegt | `npm run dev -- --port 3000` |

### Linting

| Problem | Lösung |
|---------|--------|
| Fehler in dist/ | `ignorePatterns` in .eslintrc.cjs prüfen |
| jsxBracketSameLine deprecated | Durch `bracketSameLine` ersetzen |

### CI/CD

| Problem | Lösung |
|---------|--------|
| Workflow failed | Lokal `npm run build` testen |
| Qodana Token ungültig | Neuen Token auf qodana.cloud erstellen |
| Alte Version auf Pages | Hard Refresh (Ctrl+Shift+R) |

### Schnelle Diagnose

```bash
# Alle Checks
npm run lint && npm run build

# Reset bei Problemen
rm -rf node_modules package-lock.json
npm install
```

---

## Weiterführende Links

- [Vite Dokumentation](https://vitejs.dev/)
- [React Dokumentation](https://react.dev/)
- [Material-UI Dokumentation](https://mui.com/)
- [Qodana Dokumentation](https://www.jetbrains.com/help/qodana/)
- [ESLint Dokumentation](https://eslint.org/)
- [Prettier Dokumentation](https://prettier.io/)
