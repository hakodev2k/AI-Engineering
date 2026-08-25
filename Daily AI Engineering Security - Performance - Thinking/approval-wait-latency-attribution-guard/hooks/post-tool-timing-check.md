# Hook: Post-Tool Timing Check

## Trigger
Before accepting a performance conclusion based on tool traces.

## Preconditions
Python 3.10+; JSONL trace exists.

## Action
Validate lifecycle ordering and attribution completeness.

## Script/command
`python3 scripts/attribution_guard.py <trace.jsonl>`

## Expected result
Exit 0 and every tool used as performance evidence has `status: attributable`.

## Failure behavior
Exit 2 blocks the performance conclusion. Exit 1 blocks completion because input is invalid.

## Blocks completion
Yes, when timing is used to justify an implementation or design change.