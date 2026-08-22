# Post-Tool Burst Check Hook

## Trigger
After each completed/failed tool call and before the next model-driven tool call.

## Preconditions
The host can append a JSONL event containing step, tool, target/domain, prompt tokens when available, elapsed milliseconds, and checkpoint marker.

## Action
Evaluate accumulated events since the last valid checkpoint against the trusted burst policy.

## Script/command
```bash
python scripts/tool_burst_guard.py events.jsonl --policy config/burst-policy.json --strict
```

## Expected result
Exit 0 means normal continuation. Exit 3 means the runtime must stop ordinary tool chaining and request/emit a structured consolidation checkpoint. Exit 2 blocks enforcement due to invalid telemetry/config and falls back to the existing hard global limit.

## Failure behavior
Do not silently reset counters. Do not weaken security checks, tests, or approvals. Log only operational telemetry needed for diagnosis.

## Blocks completion?
A `checkpoint_required` result blocks additional ordinary tool calls until a valid checkpoint event or user continuation resets the burst according to host policy.
