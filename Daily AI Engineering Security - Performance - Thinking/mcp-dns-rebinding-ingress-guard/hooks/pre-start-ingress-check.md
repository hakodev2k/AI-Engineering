# Hook: Pre-start MCP Ingress Check

## Trigger
Before starting or reloading an MCP HTTP/SSE server.

## Preconditions
Runtime bind address, allowed-host/origin policy, authentication mode and exposed-tool inventory are available.

## Action
Construct an event representing the intended runtime configuration and execute:
`python scripts/ingress_guard.py --event <event.json> --policy config/policy.json`

Also run `python -m unittest tests/test_ingress_guard.py` after dependency or transport changes.

## Expected result
Exit code 0 and decision `allow` for approved local configuration; hostile regression fixtures remain blocked.

## Failure behavior
Do not start/reload the MCP HTTP listener. Preserve reason codes and configuration evidence without credentials.

## Blocks completion
Yes.
