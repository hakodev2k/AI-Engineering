# Hook: Pre-Compaction Snapshot Gate
## Trigger
Immediately before any automatic compaction/summarization that removes or replaces active history.
## Preconditions
A snapshot JSON exists with context window, persisted total, latest context, cumulative run usage and provenance.
## Action
Run `python scripts/compaction_snapshot_guard.py --input <snapshot.json> --policy config/policy.json`.
## Expected result
Exit 0 only when snapshot integrity is valid. If compaction is requested, the trusted latest-context utilization must also meet policy threshold.
## Failure behavior
Exit 3 suppresses automatic compaction and permits one fresh snapshot recomputation. Exit 2 blocks because input/configuration is invalid. Preserve history and emit reason codes.
## Blocking
Yes for destructive automatic compaction.
