# Hook: Post-Compaction Effectiveness

## Trigger
Immediately after compaction metrics are committed, and again after the next turn when available.

## Preconditions
Event contains comparable `tokens_before` and `tokens_after`; policy exists.

## Action
Append event to JSONL and run `python scripts/compaction_watchdog.py <policy.json> <events.jsonl>`.

## Expected result
Exit 0.

## Failure behavior
Exit 5 opens the compaction circuit breaker: do not automatically compact again until recount/diagnosis. Exit 1 blocks because evidence is malformed.

## Blocks completion
Yes for token-optimization verification; yes for repeated auto-compaction after an ineffective event.