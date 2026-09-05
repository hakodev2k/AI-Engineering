# Hook: MCP Security Preflight

## Trigger
Before starting or deploying an MCP HTTP/SSE/streamable-HTTP service.

## Preconditions
A deployment model JSON exists and contains every listener.

## Action
Run the deterministic policy checker.

## Script / command
`python scripts/check_mcp_exposure.py <deployment.json>`

## Expected result
Exit 0 and a PASS summary.

## Failure behavior
Exit 2 blocks deployment. Exit 1 blocks deployment because configuration could not be validated. Store checker output as evidence.

## Blocks completion
Yes. A failure may only be cleared by remediation or an explicit approved exception represented in policy and accepted by organizational process; the checker itself remains fail-closed.