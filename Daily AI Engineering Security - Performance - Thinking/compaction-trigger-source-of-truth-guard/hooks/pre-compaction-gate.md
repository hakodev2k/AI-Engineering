# Hook: Pre-Compaction Gate

## Trigger
Immediately before automatic context compaction.

## Preconditions
Runtime has a candidate token snapshot and context-window configuration.

## Action
Serialize candidate metrics to JSON and execute:
`python scripts/compaction_guard.py <snapshot.json> --context-window <N> --threshold <0..1>`

## Expected result
Exit 0: trustworthy snapshot below threshold; do not compact. Exit 3: trustworthy snapshot at/above threshold; compaction allowed. Exit 2/4: block automatic compaction and recompute or escalate.

## Failure behavior
Invalid/ambiguous provenance is fail-closed with respect to destructive compaction. Do not silently fall back to cumulative usage.

## Blocks completion
Yes for automatic compaction decisions whose source cannot be verified.