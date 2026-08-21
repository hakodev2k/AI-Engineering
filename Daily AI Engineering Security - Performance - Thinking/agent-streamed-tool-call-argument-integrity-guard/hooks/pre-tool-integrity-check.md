# Hook: Pre-Tool Integrity Check

## Trigger
Immediately after streamed tool-call assembly and before tool execution.

## Preconditions
Raw arguments, stream completion state, tool name/schema, repair status, execution state, and retry count are available.

## Action
Serialize those fields to a temporary JSON file and run:

`python scripts/argument_integrity_gate.py <input.json> --policy config/policy.json`

## Expected result
Exit `0` permits execution. Exit `3` requests a fresh pre-execution generation retry. Exit `4` blocks execution. Exit `2` indicates invalid guard input and blocks side-effecting execution.

## Failure behavior
Any missing integrity evidence for a side-effecting tool is fail-closed. The runtime must surface a structured failure rather than synthesize success.

## Blocks completion
Yes. A blocked or invalid side-effecting call prevents the parent task from claiming the intended operation completed.
