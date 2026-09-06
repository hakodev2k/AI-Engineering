# Hook: Pre-task Outbox Validation

**Trigger:** before implementation.

**Preconditions:** repository root is readable and Python 3.9+ is available.

**Action:** `python scripts/outbox_check.py scan --root . --policy config/outbox-policy.json --out .outbox/evidence.json`

**Expected result:** structured evidence is produced. `pass` means required concepts were found heuristically; it is not proof of semantic correctness.

**Failure behavior:** preserve evidence, collect repository proof for missing concepts, and block unsupported assumptions.

**Blocks execution:** yes when the script returns an input/tool error; semantic findings require investigation before editing.