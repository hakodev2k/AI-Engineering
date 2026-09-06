# Pre-dispatch Route Check Hook

## Trigger
Immediately before emitting a subagent progress, completion, approval, or control event.

## Preconditions
Canonical registry snapshot and candidate event JSON exist.

## Action
Run the deterministic route verifier against the current registry.

## Script/command
`python3 scripts/verify_route.py --registry runtime/lineage.json --event runtime/event.json`

## Expected result
Exit code `0` and JSON verdict `accepted: true` only when the event's run/parent/worker/destination tuple matches canonical state and the worker belongs to the destination parent.

## Failure behavior
Exit code `2` blocks dispatch and quarantines the event for operator/runtime review. Exit code `3` indicates malformed input and also blocks dispatch.

## Blocking
Yes for completion, approval, writes, or any event that changes parent task state. Progress-only telemetry SHOULD also be blocked on mismatch to prevent task-identity contamination.
