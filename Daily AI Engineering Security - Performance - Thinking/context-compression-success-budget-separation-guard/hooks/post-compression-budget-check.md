# Hook: Post-Compression Budget Check

## Trigger
After each compression attempt and again after the first model result that follows a materially reduced compression.

## Preconditions
The host records path type, before/after pressure, compression status, and an error ID for reactive recovery attempts.

## Action
Append the event to a JSONL budget trace and run:

`python scripts/compression_budget_guard.py <events.jsonl> --policy config/policy.json`

## Expected result
- Productive maintenance remains available after prior verified maintenance cycles.
- Repeated no-progress attempts terminate at the configured failure bound.
- Reactive retries terminate at their per-error bound.
- The absolute per-turn compression-event bound is never bypassed.

## Failure behavior
If the script returns invalid input, block the optimization path and keep the runtime's stricter existing safety behavior. If it returns stop/handoff, do not silently reset counters; surface the reason and use a controlled handoff if supported.

## Blocks completion
Yes when verification depends on the affected compression path. A performance improvement cannot be marked verified while the guard reports an invalid, stop, or handoff condition that the implementation ignores.
