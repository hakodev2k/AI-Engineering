# Hook: Dispatch Regression Check

## Trigger
After a streaming dispatch/scheduler change and before release.

## Preconditions
Representative JSONL lifecycle trace exists and contains safety-ready timestamps.

## Action
Run `python scripts/dispatch_profiler.py trace.jsonl --threshold-ms 100` and persist the report. For before/after verification, run the command on both traces and compare p50/p95 with the same workload.

## Expected result
Valid timestamps, zero safety-order violations, and documented dispatch-wait distribution. A performance release claim additionally requires measured matched-workload improvement.

## Failure behavior
Invalid timestamps, tool start before safety readiness, or negative durations block completion. Lack of improvement blocks the performance claim but does not justify weakening safety checks.

## Blocking
Yes for integrity/safety failures; yes for any claimed optimization that lacks before/after evidence.
