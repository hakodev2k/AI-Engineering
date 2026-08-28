# Hook: MCP Transport Resource Preflight

## Trigger
Before starting an MCP HTTP/SSE client or server process.

## Preconditions
`config/limits.json` exists and an observation/config adapter emits the required JSON fields.

## Action
Run:
`python scripts/resource_guard.py --observation <preflight-observation.json> --limits config/limits.json`

## Expected result
Exit code `0` and decision `allow`.

## Failure behavior
Any invalid/missing bound or observed limit violation blocks startup for internet-exposed transports.

## Blocks completion
Yes.
