# Lifecycle hook adapters
These are commands to wire into the agent's local lifecycle system; no universal agent hook API is assumed.
- **Pre-edit:** `git status --porcelain` and `git rev-parse HEAD`; nonempty unexplained status blocks.
- **Post-edit / pre-review:** `node scripts/scope-guard.mjs --mode working --base BASE_SHA --policy config/policy.json --report artifacts/scope-report.json`; exit 2 or 3 blocks.
- **Pre-commit:** `node scripts/scope-guard.mjs --mode staged --base BASE_SHA --policy config/policy.json --report artifacts/staged-scope-report.json`; nonzero blocks.
- **Final:** Run project-specific tests and independent review; never infer success from hook alone.
Set BASE_SHA to captured commit; invoke from repository root. The guard is read-only except for its report file.
