# Hook: Pre-Compaction Barrier

## Trigger
Immediately before any automatic/manual compaction mutates active session history.

## Preconditions
A JSON event contains scoped token metrics, durable-history checkpoint status, history, tool-call ledger, and retry count.

## Action
Run:

`python scripts/compaction_guard.py --event <event.json> --policy config/policy.json`

After candidate generation, run the same command with `--verify-after <candidate_current_context_tokens>`.

## Expected result
Exit 0 permits preparation/commit only when all deterministic constraints pass. Exit 3 means defer or rollback.

## Failure behavior
Keep original history active; do not replay side effects; log reason codes and transcript digest without secrets.

## Blocks completion
Yes. A non-zero result blocks compaction commit.
