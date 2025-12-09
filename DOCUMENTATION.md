# 📚 Kegelbuch — Technical Documentation

Complete technical documentation for the Kegelbuch project.  
*Komplette technische Dokumentation für das Kegelbuch-Projekt.*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [CI/CD Pipeline](#4-cicd-pipeline)
5. [Qodana Code Analysis](#5-qodana-code-analysis)
6. [Auto-Fix & Linting](#6-auto-fix--linting)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Project Overview

The Kegelbuch is a modern web application for digital management of bowling evenings, players, and results.

### Architecture

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

### Build Process

```
Source Files (.jsx, .js)  →  Vite (esbuild)  →  dist/  →  GitHub Pages
```

---

## 2. Tech Stack

| Area | Technology | Version |
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
- `@mui/material`, `@mui/icons-material` — UI Components
- `@emotion/react`, `@emotion/styled`, `@emotion/cache` — Styling

**Development:**
- `vite`, `@vitejs/plugin-react` — Build Tool
- `eslint`, `eslint-plugin-react` — Linting
- `prettier` — Formatting

---

## 3. Project Structure

```
Kegelbuch/
├── .github/workflows/
│   ├── pages.yml              # Build & Deploy Pipeline
│   └── qodana.yml             # Code-Analyse Pipeline
├── src/
│   ├── components/
│   │   └── KegelabendTable.jsx  # Editable table component
│   ├── config/
│   │   └── defaultConfig.js     # Default penalties, fees, game types
│   ├── services/
│   │   └── storageService.js    # LocalStorage & JSON import/export
│   ├── App.jsx                # Main React component
│   ├── main.jsx               # React entry point
│   └── theme.js               # MUI Theme definition
├── index.html                 # HTML entry point
├── package.json               # Dependencies & Scripts
├── vite.config.js             # Vite build configuration
├── .eslintrc.cjs              # ESLint rules
├── .prettierrc                # Prettier configuration
├── .qodana.yaml               # Qodana configuration
├── .gitignore                 # Ignored files
├── README.md                  # Project overview
├── TODO.md                    # Feature roadmap
└── DOCUMENTATION.md           # This file
```

### Data Model

```javascript
// Kegelabend (Bowling Evening)
{
  id: "uuid",
  datum: "2025-12-09",
  spieler: [...],
  notizen: "",
  abgeschlossen: false
}

// Spieler (Player)
{
  id: "uuid",
  name: "Max",
  anwesend: true,
  strafen: { kalle: 2, stina: 1 },
  spiele: { wm: "120", gs: "Win" }
}
```

### Penalty Types

| ID | Label | Price | Type |
|----|-------|-------|------|
| kalle | Kalle | 0.50€ | Normal (player pays) |
| stina | Stina | 0.50€ | Normal |
| verspaetung | Verspätung | 1.00€ | Normal |
| verloren | Spiel verloren | 0.50€ | Normal |
| kranz | Kranz | 0.50€ | **Inverted** (others pay) |
| volle | Volle | 0.50€ | **Inverted** (others pay) |

> **Note:** Penalties can be added, edited, and deleted via the Settings menu.

### App Features

#### Settings Menu (⚙️)
Top right in header:
- **Player Master Data** — Create and manage players
- **Configure Prices** — Adjust entry fee and penalty prices, add new penalties

#### Add Player
When clicking "+ Spieler hinzufügen":
1. Dropdown with all saved players
2. "Neuer Spieler..." opens dialog
3. New player is added to master data AND current evening

#### Table Features
- **Nr.** — Automatic row numbering
- **Visual Separation** — Lines between penalties, games, and total
- **Auto-Save** — Changes saved automatically
- **Colored Total** — Highlighted sum column

### Code Patterns & Performance

#### React Hooks Used
| Hook | Purpose |
|------|---------|
| `useState` | Local component state |
| `useEffect` | Auto-save, data loading |
| `useCallback` | Memoized event handlers |
| `useMemo` | Cached calculations (grandTotal) |

#### Key Functions
```javascript
// Generic player update (DRY pattern)
const updatePlayer = useCallback((playerId, updateFn) => {
  const updated = kegelabend.spieler.map(p =>
    p.id === playerId ? updateFn(p) : p
  );
  onUpdate({ ...kegelabend, spieler: updated });
}, [kegelabend, onUpdate]);

// Functional state update (safe async)
setKegelabende(prev => {
  const updated = [...prev];
  // modify...
  saveKegelabende(updated);
  return updated;
});

// Penalty calculation with reduce
const calculatePlayerTotal = (player, config, allPlayers) => 
  config.strafen.reduce((total, strafe) => {
    if (strafe.inverted) {
      const othersCount = allPlayers
        .filter(p => p.id !== player.id)
        .reduce((sum, p) => sum + (p.strafen[strafe.id] || 0), 0);
      return total + othersCount * strafe.preis;
    }
    return total + (player.strafen[strafe.id] || 0) * strafe.preis;
  }, config.startgebuehr);
```

---

## 4. CI/CD Pipeline

The project uses two GitHub Actions workflows.

### 4.1 Deploy Workflow (`pages.yml`)

**Trigger:** Push to `main`, manual

| Step | Description |
|------|-------------|
| Checkout | Clone repository |
| Setup Node | Configure Node.js 18 |
| Install | `npm ci` |
| Build | `npm run build` |
| Deploy | GitHub Pages |

**Live-URL:** [https://flutty20.github.io/Kegelbuch/](https://flutty20.github.io/Kegelbuch/)

### 4.2 Qodana Workflow (`qodana.yml`)

**Trigger:** Push/PR to `main`, manual

| Step | Description |
|------|-------------|
| Checkout | Clone repository with history |
| Setup Node | Configure Node.js 18 |
| Install | `npm ci` |
| Scan | Qodana code analysis |

**Results:** [qodana.cloud](https://qodana.cloud)

### Run Workflow Manually

1. **Actions** → Select workflow → **Run workflow**

---

## 5. Qodana Code Analysis

### Configuration (`.qodana.yaml`)

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

### Setup Token

1. Create project on [qodana.cloud](https://qodana.cloud)
2. Copy Project Token
3. Create GitHub Secret:
   - **Settings** → **Secrets and variables** → **Actions**
   - Name: `QODANA_TOKEN_1646119969`
   - Value: *Paste token*

### Run Locally

```bash
docker run --rm -it \
  -v $(pwd):/data/project \
  -v $(pwd)/qodana-results:/data/results \
  jetbrains/qodana-js:2024.3
```

### Create Baseline

To only report new issues:

```yaml
# Add to .qodana.yaml
baseline: qodana.sarif.json
```

---

## 6. Auto-Fix & Linting

### Available Commands

| Command | Tool | Description |
|---------|------|-------------|
| `npm run lint` | ESLint | Check code |
| `npm run lint:fix` | ESLint | Auto-fix errors |
| `npm run format` | Prettier | Format code |

### Prettier Configuration (`.prettierrc`)

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

### ESLint Configuration (`.eslintrc.cjs`)

```javascript
module.exports = {
  env: { browser: true, es2021: true, node: true },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  ignorePatterns: ['dist/', 'node_modules/', '*.min.js'],
  settings: { react: { version: 'detect' } },
};
```

### IDE Integration

**VS Code** — Install extensions:
- Prettier - Code formatter
- ESLint

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## 7. Troubleshooting

### Installation

| Problem | Solution |
|---------|----------|
| `npm ci` fails | Run `npm install` |
| Module not found | Run `npm install` again |

### Build

| Problem | Solution |
|---------|----------|
| terser not found | `minify: 'esbuild'` in vite.config.js |
| 404 on GitHub Pages | Check `base` path in vite.config.js |
| Port 5173 in use | `npm run dev -- --port 3000` |

### Linting

| Problem | Solution |
|---------|----------|
| Errors in dist/ | Check `ignorePatterns` in .eslintrc.cjs |
| jsxBracketSameLine deprecated | Replace with `bracketSameLine` |

### CI/CD

| Problem | Solution |
|---------|----------|
| Workflow failed | Test `npm run build` locally |
| Qodana Token invalid | Create new token on qodana.cloud |
| Old version on Pages | Hard Refresh (Ctrl+Shift+R) |

### Quick Diagnosis

```bash
# All checks
npm run lint && npm run build

# Reset on problems
rm -rf node_modules package-lock.json
npm install
```

---

## Further Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Qodana Documentation](https://www.jetbrains.com/help/qodana/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
