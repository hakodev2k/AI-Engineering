# Hook: Phase Benchmark Gate

## Trigger
After collecting a benchmark trace for a performance-sensitive change.

## Preconditions
JSONL trace exists and benchmark correctness check has completed.

## Action
Validate and summarize the trace.

## Command
```bash
python scripts/phase_latency.py "$TRACE_FILE"
```

## Expected result
Exit code `0`, no validation errors, named phase durations, and timing marks where configured.

## Failure behavior
Retry collection once if a logger flush was interrupted. If validation still fails, block the performance claim and preserve the trace.

## Blocking
Yes for `Measured`/`Verified` performance status. It does not block functional completion unless the project separately requires the performance SLO.