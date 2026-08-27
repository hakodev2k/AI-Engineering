# Hook: Post-Session Cache Check

## Trigger
After benchmark/session trace collection or before accepting a cache-related optimization.

## Preconditions
A JSONL usage trace with the required fields exists.

## Action
Run:
`python scripts/cache_churn_guard.py <trace.jsonl>`

## Expected result
Exit 0 and a JSON report with no blocking policy reasons.

## Failure behavior
Exit 2 blocks completion because telemetry/input is invalid. Exit 3 blocks completion because measured churn exceeds policy.

## Blocking
Yes for verification; advisory during exploratory diagnosis.
