# Hook: Post-Tool Result Reuse Check

## Trigger
Immediately after a tool has executed and before its result is appended to model-visible context.

## Preconditions
The tool execution completed, fresh output is available, read-only annotation is known, context epoch is known, and any prior visibility record is available.

## Action
Invoke the reuse gate with the fresh result. Use the returned `model_payload` only; never suppress the underlying tool execution.

## Script/command
```bash
python3 scripts/tool_result_reuse_gate.py result.json --policy config/policy.json
```

## Expected result
- Exit `0`: emit full fresh payload and persist/update returned visibility record.
- Exit `10`: emit deterministic reuse marker and record saved bytes/tokens.

## Failure behavior
Exit `2` or any integration error MUST fall back to emitting the full fresh tool result. Log only sanitized gate metadata. A gate failure MUST NOT block the user's task or convert a successful tool result into an error.

## Blocking
No for availability: fail open to **full fresh payload**, not to reuse. Yes for optimization verification: a gate error blocks claims that the optimization is verified.