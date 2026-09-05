# Hook: Post Tool Batch Integrity

## Trigger
After tool execution/approval resolution and before the next model invocation.

## Preconditions
Runtime can serialize the current turn into the canonical JSON schema containing `calls` and `results`.

## Action
Run the deterministic turn-integrity checker.

## Script / command
`python scripts/verify_tool_batch.py config/policy.example.json <turn.json>`

## Expected result
Exit 0 with `PASS` and matching call/result counts.

## Failure behavior
Exit 4 blocks the next model step and stores the trace as evidence. Exit 1 also blocks because state cannot be validated. A safe idempotent transport replay may occur once; otherwise stop/escalate.

## Blocks completion
Yes.