# Hook: Post-Run Observation Yield Check

## Trigger
After a browser-assisted benchmark or agent task emits its final trace.

## Preconditions
Trace is complete JSONL; task success/failure is already recorded separately; thresholds file is available.

## Action
Run the profiler and capture its JSON summary as benchmark evidence.

## Script/command
```bash
python scripts/browser_yield_profiler.py "$TRACE_JSONL" --thresholds config/thresholds.example.json
```

## Expected result
Exit 0 when the trace is valid and configured efficiency thresholds pass. Exit 2 when thresholds fail. Exit 3 for malformed input/configuration.

## Failure behavior
A failed threshold blocks a performance-success claim but does not authorize removing required correctness/security checks. Invalid telemetry blocks verification until instrumentation is fixed.

## Blocks completion
Yes for benchmark-and-optimize workflow verification.