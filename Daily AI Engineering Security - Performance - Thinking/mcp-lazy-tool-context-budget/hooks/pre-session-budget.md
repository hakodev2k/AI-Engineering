# Hook: Pre-Session Tool Budget

## Trigger
Before eager MCP/tool initialization or before assembling the first model context.

## Preconditions
A measured tool inventory, task requirement file, and `config/budget.json` exist.

## Action
Run:
`python scripts/tool_activation_plan.py --inventory <inventory.json> --budget config/budget.json --task <task.json>`

## Expected result
Exit 0 with an explicit active/deferred set and before/after token/startup estimates.

## Failure behavior
Exit 3 blocks optimization when required capabilities exceed the budget; the caller MUST raise the budget, simplify required schemas, or use another architecture rather than dropping required tools.

## Blocks completion
Yes when the inventory is invalid or required capabilities cannot fit. No when a valid budgeted plan is produced; quality verification is still required before claiming savings.
