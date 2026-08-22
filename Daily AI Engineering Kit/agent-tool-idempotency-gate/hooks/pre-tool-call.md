# Hook: Pre Tool Call

**Trigger:** immediately before any side-effecting tool invocation.

**Preconditions:** intent JSON exists; material arguments are final; required approval is available when flagged.

**Action:** run `python scripts/idempotency_gate.py claim --intent <intent.json>`.

**Expected result:** JSON status `claimed` and exit code 0. `already_succeeded` means skip mutation and reuse the recorded result. All other statuses block mutation.

**Failure behavior:** validation error, fingerprint drift, in-progress state, ambiguity, retry exhaustion, or missing ledger access blocks execution. Preserve command output as evidence without secrets.

**Blocking:** yes.
