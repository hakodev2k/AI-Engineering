# Hook: Post-Run Liveness Check

## Trigger
After an integration/benchmark run produces a lifecycle NDJSON trace.

## Preconditions
Trace contains unique IDs for turns, control requests and workers.

## Action
Run `python scripts/control_stream_guard.py "$CONTROL_STREAM_TRACE"`.

## Expected result
Exit `0`; no premature transport close and no unmatched lifecycle events.

## Failure behavior
Exit `2` blocks regression completion and preserves the trace. Exit `64` blocks because evidence is malformed.

## Blocking
Yes for release/benchmark verification. Retry the workload at most twice when nondeterminism is suspected.
