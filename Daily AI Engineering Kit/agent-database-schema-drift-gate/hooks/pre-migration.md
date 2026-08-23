# Hook: Pre-Migration Schema Validation

**Trigger:** before accepting or executing a generated migration.

**Preconditions:** baseline and candidate JSON snapshots exist; Python 3.10+ is available; no production mutation is required.

**Action:** run:

`python scripts/schema_drift.py --baseline "$SCHEMA_BASELINE" --candidate "$SCHEMA_CANDIDATE" --report artifacts/schema-drift-report.json`

**Expected result:** exit 0 and a valid JSON report with `blocking=false`.

**Failure behavior:** exit 2 blocks progression and requires investigation/approval; exit 1 blocks progression because evidence/tooling is invalid. Do not retry policy failures unchanged. Transient snapshot-export commands preceding this hook may be retried at most twice.

**Blocking:** yes.
