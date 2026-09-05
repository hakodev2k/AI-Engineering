# Hook: Post-Run Latency Profile

## Trigger
After benchmark/agent run with phase trace.

## Preconditions
JSONL trace and threshold config exist.

## Action
Run `python scripts/latency_attribution.py <trace.jsonl> <thresholds.json>`.

## Expected result
Exit 0 with phase statistics and adequate coverage.

## Failure behavior
Exit 2 blocks causal claim for insufficient samples/coverage. Exit 3 blocks performance completion because p95 target is exceeded. Exit 1 blocks invalid input.

## Blocks completion
Yes for measured performance claims.