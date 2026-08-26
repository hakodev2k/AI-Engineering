# Hook — Post Review Gate

## Trigger
After each reviewer batch and before the coordinator authorizes new implementation work or another review cycle.

## Preconditions
Approved requirement IDs, findings, cycle number, maximum cycles, previous progress units and current progress units are recorded.

## Action
Serialize state and run `python scripts/review_scope_gate.py <state.json>`.

## Expected result
Only evidence-backed, in-scope, diff-caused and reproducible findings may produce `rework`. Out-of-scope findings are deferred. Cycle exhaustion or unjustified no-progress continuation returns a blocking nonzero status.

## Failure behavior
Stop automatic continuation, preserve evidence, and escalate according to `workflows/failure-recovery.md`.

## Blocks completion
Yes when a valid in-scope blocker remains. It also blocks another autonomous cycle when the retry budget is exhausted.
