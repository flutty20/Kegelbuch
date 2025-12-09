# Auto‑Fixes (lokal und CI)

Dieses Projekt nutzt Prettier und ESLint zur automatischen Behebung von einfachen Codeproblemen.

Lokale Verwendung:

1. Formatiere das Projekt mit Prettier:

```powershell
npm run format
```

2. Führe ESLint mit Auto‑Fix aus:

```powershell
npm run lint:fix
```

CI‑Verhalten (wie im Workflow definiert):

- Der CI‑Job führt `npm run format` und `npm run lint:fix` aus.
- Wenn Änderungen erzeugt werden, committet der Job sie automatisch mit der Nachricht `chore: apply automatic fixes [skip ci]` und pusht sie zurück zum aktuellen Branch. `[skip ci]` verhindert, dass der Commit erneut den Workflow triggert.

Optionen:

- Wenn du nicht möchtest, dass Änderungen direkt nach `main` gepusht werden, kann die Pipeline so angepasst werden, dass stattdessen ein Pull Request erstellt wird (empfohlen für geschützte Branches).
