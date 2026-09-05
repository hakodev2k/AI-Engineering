# Hook: Pre-Task Capability Check

## Trigger
Before a tool-dependent agent begins planning/execution, and after any connector refresh/reconnect or registry-change event.

## Preconditions
Normalized contract JSON contains advertised, visible, and required tool lists.

## Action
Run the capability sentinel.

## Script / command
`python scripts/tool_registry_sentinel.py <contract.json>`

## Expected result
Exit 0 with `decision: "pass"` and `required_coverage: 1.0`.

## Failure behavior
Exit 4 blocks execution and writes a missing-tool/capacity diagnostic. Exit 1 blocks because validation could not be trusted.

## Blocks completion
Yes. The agent may not infer a missing capability from connector health or bypass the hook by rewriting requirements.