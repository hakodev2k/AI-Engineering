# Hook: Post Compaction
## Trigger
Immediately after compaction and before compacted context becomes authoritative.
## Preconditions
Provider before/after counts, summary, required inventory, verified retrieval references available.
## Action
`python scripts/compaction_guard.py --event <context-snapshot.json> --budget config/budget.json`
## Expected result
Exit `0` only when token budgets/reduction and critical retention both pass.
## Failure behavior
Exit `3` rejects compacted state and preserves/restores known-good context or enters bounded recovery. Exit `2` blocks invalid telemetry/configuration.
## Blocking
Yes. Failed critical retention MUST block acceptance.