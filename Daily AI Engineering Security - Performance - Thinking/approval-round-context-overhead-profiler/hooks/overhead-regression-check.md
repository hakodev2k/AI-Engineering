# Hook: Approval Context Overhead Regression Check

## Trigger
Run after benchmark fixtures complete and before accepting an optimization.

## Preconditions
Baseline and candidate telemetry JSONL were produced from equivalent fixtures.

## Action
Execute:

`python scripts/analyze_overhead.py candidate.jsonl --baseline baseline.jsonl --policy config/policy.json --strict`

## Expected result
Exit code 0 with a JSON report showing no approval/correctness regression and performance inside policy thresholds.

## Failure behavior
Non-zero exit blocks completion. Preserve telemetry and report the failing metric. Do not relax approval rules to make the hook pass.

## Blocking
Yes.
