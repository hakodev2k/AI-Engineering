# Hook — Pre-Context Injection

## Trigger
Immediately before any MCP discovery instruction text is added to model context.

## Preconditions
- `server_id` and instruction text are available.
- Effective host permissions are resolved.
- `config/policy.json` is readable and validated.

## Action
Serialize the candidate payload to a temporary local JSON file and execute:

```bash
python scripts/instruction_gate.py candidate.json --policy config/policy.json
```

The hook reads the JSON decision from stdout.

## Expected result
- Exit `0`: `decision=allow`; caller may inject only `bounded_instructions`, preserving its untrusted label.
- Exit `4`: `decision=review`; caller must block injection until explicit approval is recorded for the current hash.
- Exit `5`: `decision=deny`; caller blocks the instruction.
- Exit `2`: invalid input/policy; caller blocks and raises configuration/error telemetry.

## Failure behavior
Fail closed. Do not fall back to raw server text. Record server ID, hash when available, rule IDs, and policy version without secret values.

## Blocks completion
Yes. Any nonzero exit blocks automatic context admission.
