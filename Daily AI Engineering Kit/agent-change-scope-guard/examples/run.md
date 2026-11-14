# Example
From repository root, copy the package's `config`, `scripts`, `tests`, and agent instructions to the same relative paths.
Capture `BASE_SHA=$(git rev-parse HEAD)` in Bash (PowerShell: `$BASE_SHA = git rev-parse HEAD`).
Edit `config/policy.json` to match approved project directories.
Run `node --test tests/scope-guard.test.mjs`.
After edits: `node scripts/scope-guard.mjs --base HEAD --mode working`.
For staged changes: `node scripts/scope-guard.mjs --base HEAD --mode staged`.
Read `artifacts/scope-report.json`; exit 0 is in-scope, 2 policy failure, 3 configuration/tool failure.
