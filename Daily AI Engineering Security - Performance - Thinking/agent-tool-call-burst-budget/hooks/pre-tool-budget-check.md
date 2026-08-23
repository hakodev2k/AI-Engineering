# Hook — Pre-Tool Budget Check

## Trigger
Immediately before every tool invocation.

## Preconditions
Current turn trace is available as JSONL and the budget config is readable.

## Action
Append the pending call metadata to a temporary trace snapshot, then run `scripts/burst_budget.py` against the snapshot and configured budget.

## Command
`python scripts/burst_budget.py current-turn.jsonl --policy config/budget.json --strict`

## Expected result
Exit `0` means allow. Exit `3` means defer/block according to the JSON decision. Exit `2` means invalid input/configuration.

## Failure behavior
Invalid configuration blocks autonomous execution and requires operator correction. A budget block must be logged with counters and reason; it must not be silently converted to allow.

## Blocks completion
Yes for invalid configuration or an unresolved hard block. A defer decision may resume only after the returned cooldown/changed-state condition is satisfied.
