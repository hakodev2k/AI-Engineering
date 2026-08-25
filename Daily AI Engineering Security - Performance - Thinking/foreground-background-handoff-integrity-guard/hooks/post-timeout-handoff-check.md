# Hook: Post-Timeout Handoff Check

## Trigger
After a benchmark/test run containing a foreground→background transition and before claiming completion.

## Preconditions
Lifecycle JSONL is complete for the benchmark window and deadlines are configured.

## Action
Run `python3 scripts/handoff_guard.py <trace.jsonl> --ack-deadline 5 --notify-deadline 10 --json`.

## Expected result
Exit `0`, `healthy=true`, and no missing/late/duplicate lifecycle violations.

## Failure behavior
Exit `3` blocks performance verification and routes back to diagnosis. Exit `2` blocks because the trace/config is invalid.

## Blocking
Yes for verification. The hook observes traces only; it never mutates or kills a running process.
