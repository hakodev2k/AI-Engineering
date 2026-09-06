# Hook: Pre-Write Evidence Gate

## Trigger
Immediately before the first mutation of a tracked source/configuration file for an issue-resolution task.

## Preconditions
A JSON decision record exists and the repository baseline has been captured.

## Action
Run:

`python scripts/decision_gate.py decision.json`

## Expected result
Exit code `0` only when the record is structurally complete and the decision is `change-required` with sufficient independent evidence. `no-change` is a successful workflow outcome but intentionally returns a non-write code so a write-capable phase cannot begin.

## Failure behavior
- Exit `2`: invalid input or malformed record; block completion and repair the evidence artifact.
- Exit `3`: insufficient evidence; block writes and return to diagnosis.
- Exit `4`: decision is `no-change`; block writes and route directly to no-change verification.
- Exit `5`: contradictory evidence or unverified status; block writes and require review.

## Blocking
Yes. Failure MUST block tracked source mutation. The hook MUST NOT be bypassed merely to make progress.
