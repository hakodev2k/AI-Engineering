# Hook: Final Generated Client Verification

**Trigger:** after remediation and repository tests.

**Preconditions:** clean worktree/candidate state, generator commands configured, required approvals recorded.

**Action:** `python scripts/gate.py regenerate --config config/gate-config.json --out .openapi-drift/regenerate.json`

**Expected result:** exit 0 and status `verified`, meaning regeneration created no generated-file drift.

**Failure behavior:** preserve generator logs and Git status; deterministic drift blocks completion. Retry only transient tool/network failures, maximum 2 times.

**Blocks completion:** yes.
