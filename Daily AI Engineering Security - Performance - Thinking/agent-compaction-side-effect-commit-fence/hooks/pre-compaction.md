# Hook: Pre-Compaction Admission
## Trigger
Immediately before context compression, transcript rotation, or parent-session teardown.
## Preconditions
Current side-effect ledger has been flushed; queued messages/results are snapshotted.
## Action
Run `python scripts/compaction_fence.py <ledger.json>`.
## Expected result
Exit 0 and decision `allow`.
## Failure behavior
Exit 3 blocks compaction. Refresh observable state at most once, then escalate unresolved mutations.
## Blocking
Yes.
