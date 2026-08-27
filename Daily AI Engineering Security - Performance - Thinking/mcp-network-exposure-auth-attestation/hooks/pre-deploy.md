# Hook: Pre-Deploy MCP Exposure Gate

## Trigger
Before deployment/restart promotes an MCP service into a shared or production environment.

## Preconditions
A sanitized effective-state snapshot has been generated from the candidate runtime or equivalent deployment probe.

## Action
Run:
`python scripts/exposure_attestor.py --state <effective-state.json> --policy config/policy.json`

## Expected result
Exit code `0` with `decision=allow`.

## Failure behavior
Exit code `3` blocks promotion and records reason codes; exit code `2` blocks promotion because evidence could not be evaluated.

## Blocking
Yes. The hook MUST NOT be bypassed for convenience; emergency exceptions require explicit human approval and compensating controls.
