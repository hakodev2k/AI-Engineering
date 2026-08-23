# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before investigation. **Preconditions:** repository and Python 3 available. **Action:** record Git revision, database engine/version, working-tree state; run `python scripts/scan-lock-order.py .`. **Expected:** discovery output is retained as heuristic evidence. **Failure:** tool/environment failure blocks automated investigation; do not broaden permissions. **Blocking:** yes when revision/environment cannot be identified.

## Post-edit validation
**Trigger:** after each implementation attempt. **Preconditions:** edit completed. **Action:** run host formatter/build and relevant tests, then the reproduction harness. **Expected:** build/tests pass and harness no longer reproduces target cycle. **Failure:** preserve logs, revert failed hypothesis before another attempt. **Blocking:** yes.

## Final evidence gate
**Trigger:** before declaring completion. **Preconditions:** verifier has completed independent reruns. **Action:** `python scripts/validate-evidence.py <evidence.json>`. **Expected:** exit 0 and evidence status `verified`. **Failure:** mark `blocked`; preserve validator output. **Blocking:** yes.
