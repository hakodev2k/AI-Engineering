# Hook — Host Regression Gate

## Trigger
Before releasing or accepting a fix for a host-responsiveness regression.

## Preconditions
Comparable baseline and candidate JSON probes exist.

## Action
Run:

`python scripts/analyze_probe.py --baseline baseline.json --affected candidate.json --max-p95-ratio 1.50 --max-stall64-ratio 2.0`

## Expected result
Exit 0 and a JSON report with `regression: false`.

## Failure behavior
Exit 2 blocks the performance completion claim. Exit 1 blocks because evidence is invalid/incomplete.

## Blocks completion
Yes.
