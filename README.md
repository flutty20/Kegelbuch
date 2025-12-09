# 🎳 Kegelbuch

Digital 9 pin bowling book for managing 9 pin bowling evenings, players, and results.  
*Digitales Kegelbuch zur Verwaltung von Kegelabenden, Spielern und Ergebnissen.*

## Features

- ✅ **Bowling Table** — Editable table like a physical bowling book
- ✅ **Player Management** — Add saved players or create new ones
- ✅ **Penalties** — Kalle, Stina, Late, Lost game, Kranz, Volle (configurable)
- ✅ **Inverted Penalties** — Kranz/Volle: all others pay
- ✅ **Settings Menu** — Configure prices, add/remove penalties
- ✅ **Auto-Save** — All changes saved automatically
- ✅ **JSON Export/Import** — Backup and restore data

## Quick Start

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:5173)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | Check code |
| `npm run format` | Format code |

## Tech Stack

**React 18** · **Vite 5** · **Material-UI 7** · **ESLint** · **Prettier**

## Architecture

```
src/
├── App.jsx              # Main component, global state
├── components/
│   └── KegelabendTable  # Editable table with players
├── config/
│   └── defaultConfig    # Penalties, fees, game types
└── services/
    └── storageService   # LocalStorage & JSON I/O
```

**Key patterns:**
- `useCallback` / `useMemo` for performance
- Functional state updates for safe async
- Auto-save via `useEffect`

## Links

- 🌐 **Live:** [flutty20.github.io/Kegelbuch](https://flutty20.github.io/Kegelbuch/)
- 📋 **Roadmap:** [TODO.md](./TODO.md)
- 📚 **Documentation:** [DOCUMENTATION.md](./DOCUMENTATION.md)
