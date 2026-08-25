# Hook: Pre-Dispatch Parity

## Trigger
Immediately after a tool implementation is resolved and immediately before any tool side effect.

## Preconditions
Normalized event includes `request_tools` and `tool_name`; policy is locally available and immutable for the decision.

## Action
Run the deterministic checker. ALLOW only when the requested tool is in the request set or a narrowly configured explicit global exception applies.

## Script/command
```bash
python scripts/verify_dispatch_policy.py --event "$EVENT_JSON" --policy config/policy.json
```

## Expected result
Exit 0 with `decision=allow`; exit 2 for policy block; exit 3 for invalid input/configuration.

## Failure behavior
Exit 2/3 blocks dispatch and emits a sanitized reason code. Never execute the tool as fallback.

## Blocks completion
Yes. Verification cannot pass if any dispatch path lacks this equivalent control.