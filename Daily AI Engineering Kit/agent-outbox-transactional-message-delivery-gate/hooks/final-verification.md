# Hook: Final Outbox Verification

**Trigger:** after implementation and tests.

**Preconditions:** `.outbox/evidence.json` and `.outbox/simulation.json` exist.

**Action:** `python scripts/outbox_check.py verify --evidence .outbox/evidence.json --simulation .outbox/simulation.json --out .outbox/verification.json`

**Expected result:** exit code 0 and status `verified`.

**Failure behavior:** preserve all artifacts; deterministic failures are not retried without new evidence or code changes.

**Blocks completion:** yes.