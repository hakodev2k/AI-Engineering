# Hook: Post-Compaction Regression Gate

## Trigger
After a compaction event and after the configured observation window has enough subsequent turns.

## Preconditions
Normalized telemetry contains all fields required by `scripts/compaction_regression_guard.py`.

## Action
Run:
`python scripts/compaction_regression_guard.py telemetry.json`

## Expected result
Exit code 0 and `status: pass`.

## Failure behavior
Exit code 3 blocks a performance-improvement claim and blocks release when this hook is configured as a release gate. Exit code 2 indicates invalid/missing evidence and also blocks completion.

## Blocking
Yes for benchmark/release verification.
