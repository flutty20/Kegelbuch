# Qodana — Konfiguration und Nutzung

Datei: `.qodana.yaml`

Wichtige Einstellungen in diesem Projekt:

- `image: jetbrains/qodana-js:2024.3` — wählt das Qodana Docker‑Image mit JavaScript/TypeScript Profil.
- `profile.name: Default` — das Inspektionsprofil (kann z. B. `Strict` lauten).
- `project-dir`, `output-path` — Eingangs‑/Ausgangsverzeichnisse.
- `exclude` — Ordner, die nicht analysiert werden (z. B. `node_modules`, `dist`, `.git`).
- `tools.eslint.enabled: true` — aktiviert ESLint‑Analysen und nutzt `.eslintrc.cjs`.
- `cache.enabled: true` — aktiviert Ergebnis‑Caching zur Beschleunigung.

Baseline:
- Um nur neue Probleme zu melden, kannst du eine Baseline erzeugen. Workflow‑Optionen:
  - Erzeuge lokal oder durch CI ein `qodana-baseline.zip` nach einem sauberen Lauf und speichere es im Repo oder als Artifact.
  - Ergänze `.qodana.yaml` mit `baseline: qodana-baseline.zip`.

Report‑Zugriff:
- Die Action lädt `qodana-results` als Artifact hoch. Im Actions‑UI kannst du das Artefakt herunterladen und lokal öffnen (z. B. HTML‑Report).

Tipps:
- Wenn du spezielle ESLint‑Regeln willst, passe `.eslintrc.cjs` an.
- Falls du zusätzlichen Linter (z. B. `stylelint`) möchtest, füge ihn unter `tools:` hinzu.
