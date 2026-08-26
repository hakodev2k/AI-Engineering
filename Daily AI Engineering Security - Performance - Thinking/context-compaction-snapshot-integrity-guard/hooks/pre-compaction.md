# Hook: Pre-Compaction Integrity Gate

## Trigger
Immediately before an automatic compaction decision is committed.

## Preconditions
Runtime can provide current-prompt tokens, cumulative usage, configured/effective capacity, reserve, turn identity, and snapshot source.

## Action
Serialize those fields to a temporary JSON snapshot and run:

`python scripts/compaction_snapshot_guard.py --snapshot <snapshot.json> --policy config/policy.json`

## Expected result
- Exit 0 + `defer`: continue without compaction.
- Exit 0 + `allow_compaction`: compaction may proceed.
- Exit 3 + `block_accounting_error`: do not compact; emit reason codes and route to diagnosis.

## Failure behavior
Malformed input, missing fields, stale snapshots, or capacity mismatch block automatic compaction. The hook MUST NOT silently fall back to cumulative usage.

## Blocking
Yes for accounting errors. `defer` is not an error.
