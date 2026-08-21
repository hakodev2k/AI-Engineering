# Hook: Pre-Compaction Accounting Integrity

## Trigger
Immediately before automatic compaction, eviction, or another lossy context-management action.

## Preconditions
The runtime can provide an accounting snapshot containing current-context metric, source, context window, transcript revision, and cumulative usage separately.

## Action
Run:

`python3 scripts/accounting_guard.py snapshot.json --policy config/accounting-policy.json`

Exit codes: `0=safe`, `2=invalid`, `3=integrity failure`.

## Expected result
Automatic compaction is permitted only on exit 0. The decision record identifies metric source, occupancy ratio, and findings.

## Failure behavior
Missing fields, unknown metric source, stale transcript binding, cumulative usage used as occupancy, impossible occupancy without supporting evidence, or estimator error beyond tolerance blocks automatic compaction.

## Blocking
Yes when `block_automatic_compaction_on_integrity_failure` is enabled.

## Recovery
Preserve the session and accounting evidence. Prefer remeasurement against the current serialized prompt. Do not respond by increasing the context threshold or deleting transcript state.
