# Hook — Pre-Compaction Atomicity Gate
## Trigger
Immediately before any history replacement, checkpoint pruning, or compaction commit.
## Preconditions
A fresh structured turn snapshot is available from the same execution state that will be compacted.
## Action
Run the deterministic checker using the current policy.
## Script/command
`python scripts/check_turn_state.py turn-snapshot.json --policy config/policy.json --output compaction-gate.json`
## Expected result
Exit 0 and `safe_to_compact=true`.
## Failure behavior
Exit 3 blocks compaction. Preserve original context, reconcile unresolved tools, refresh the snapshot, and retry only within the bounded workflow.
## Blocks completion
Yes.
