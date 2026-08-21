# Hook: Post-Compaction Ledger Check

## Trigger
After context compaction/state reconstruction and after a representative post-compaction read sequence.

## Preconditions
Trace includes compaction turn(s), artifact identities, content hashes, and token estimates. Optional provider usage may be included.

## Action
Run:

```bash
python scripts/read_replay_guard.py trace.json --config config/budget.json
```

## Expected result
Exit code `0`, no unchanged post-compaction full rereads beyond configured budget, and duplicate read token ratio within budget.

## Failure behavior
Exit code `2` or `3` blocks a claim that the context optimization is verified. Preserve trace output; diagnose missing ledger continuity or measurement data. Do not prune additional context merely to make the metric pass.

## Blocks completion
Yes for a token-optimization change that claims compaction/read reuse improvement. Quality verification remains separately mandatory.
