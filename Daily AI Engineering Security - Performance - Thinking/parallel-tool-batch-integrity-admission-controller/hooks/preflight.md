# Hook: Parallel Admission Preflight

## Trigger
Before increasing configured parallel tool-call concurrency.

## Preconditions
Representative trace file and SLO config exist.

## Action
Run analyzer; compare proposed concurrency with maximum verified level.

## Script / command
`python scripts/analyze_parallel_batches.py config/slo.example.json <traces.jsonl>`

## Expected result
Exit 0 and `MAX_VERIFIED_CONCURRENCY=<n>`, with proposed concurrency <= n.

## Failure behavior
Exit 3 blocks concurrency increase because no tested level meets SLO. Exit 1 blocks because evidence is invalid/incomplete.

## Blocks completion
Yes.