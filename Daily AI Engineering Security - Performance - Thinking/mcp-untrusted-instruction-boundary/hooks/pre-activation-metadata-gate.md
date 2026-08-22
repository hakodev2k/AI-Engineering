# Hook — Pre-Activation Metadata Gate

## Trigger
Immediately before MCP metadata becomes model-visible or a discovered tool is enabled.

## Preconditions
Raw metadata captured; trust policy available; credentials excluded from input.

## Action
Run `python3 scripts/mcp_metadata_gate.py metadata.json --policy config/policy.json --strict`.

## Expected result
Exit `0` with `decision=allow` and stable fingerprints.

## Failure behavior
Exit `3` quarantines metadata/tooling; exit `2` blocks due to invalid input. Any failure blocks activation.

## Blocking
Yes. Dangerous capability cannot be enabled by bypassing this hook.
