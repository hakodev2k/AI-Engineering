# Hook: Pre-task Generation Validation

**Trigger:** before generated-client remediation or release verification.

**Preconditions:** repository root, config file, and at least one configured API spec exist.

**Action:** `python scripts/gate.py snapshot --config config/gate-config.json --out .openapi-drift/before.json`

**Expected result:** exit 0 and a snapshot containing revision, dirty state, spec fingerprint, generated fingerprint, roots, and configured commands.

**Failure behavior:** preserve stderr/evidence and block remediation until the authoritative generation contract is understood.

**Blocks execution:** yes for final verification; discovery may continue read-only.
