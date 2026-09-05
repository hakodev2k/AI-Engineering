# Hook: Pre Change

## Trigger
Before modifying code intended to fix a database deadlock.

## Preconditions
Approved reproduction environment and identifiable incident path.

## Action
1. Preserve incident/native deadlock evidence.
2. Produce normalized baseline capture.
3. Run `scripts/deadlock_gate.py` against baseline plus a temporary candidate only for structural validation, or inspect baseline with tests.
4. Record affected transaction paths.

## Expected result
At least one evidence-backed cycle before remediation.

## Failure behavior
If baseline cannot be reproduced, block `fixed` status and continue only as investigation.

## Blocking
Yes for declaring a verified fix.
