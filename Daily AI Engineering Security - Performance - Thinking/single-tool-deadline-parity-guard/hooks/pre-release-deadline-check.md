# Hook: Pre-Release Deadline Check

## Trigger
Before release/deployment of an agent executor or MCP/tool integration.

## Preconditions
`deadlines.json` inventories every active execution path.

## Action
Run parity checker and stalled-call regression suite.

## Script / command
`python scripts/check_tool_deadlines.py <deadlines.json>` followed by `python -m unittest tests/test_check_tool_deadlines.py`.

## Expected result
Both commands exit 0.

## Failure behavior
Nonzero blocks completion; preserve findings and benchmark logs.

## Blocks completion
Yes. Do not bypass by setting arbitrarily huge limits or removing paths from inventory.