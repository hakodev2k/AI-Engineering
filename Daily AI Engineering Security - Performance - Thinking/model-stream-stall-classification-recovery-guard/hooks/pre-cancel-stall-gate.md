# Hook: Pre-Cancel Stall Gate

## Trigger
Immediately before watchdog cancellation of a model request.

## Preconditions
Request ID and timestamped trace are available.

## Action
Run `python scripts/stall_trace_analyzer.py <trace.jsonl> --timeout-ms <policy> --json`. Read classification and recovery count. Block generic cancellation if the trace shows active retry or a slow/queued request still below the hard ceiling. Permit terminal cancellation at hard ceiling or on explicit transport failure after the single safe recovery is exhausted.

## Expected result
A precise terminal/action classification instead of a generic stall/user-interrupt label.

## Failure behavior
Analyzer parse failure is fail-safe: do not auto-retry; preserve checkpoint and escalate. It MUST NOT silently extend indefinitely.

## Blocks completion
Yes, when a runtime would otherwise report successful recovery without classification evidence.