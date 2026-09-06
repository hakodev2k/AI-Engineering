# Hook: Residency Measurement Preflight

## Trigger
Before baseline or candidate profiling.

## Preconditions
Telemetry file exists and the runtime/model metadata is recorded.

## Action
Run:

`python scripts/residency_profiler.py <trace.jsonl> --out <report.json>`

## Expected result
Exit code 0 and a report with at least 20 valid requests, cold-start classification, latency percentiles, load-duration metrics, and idle-gap metrics.

## Failure behavior
Exit code 2 blocks completion for malformed input; exit code 3 blocks performance claims for insufficient sample size. Preserve stderr as evidence and collect a valid trace rather than weakening thresholds.

## Blocking
Yes. A failed preflight blocks optimization and verification.
