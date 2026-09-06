# Hook: MCP Destination Preflight

## Trigger
Immediately before creating an HTTP/SSE MCP connection.

## Preconditions
Raw URL is available before any socket is opened.

## Action
Execute `python scripts/validate_mcp_url.py "$MCP_SERVER_URL"` or equivalent in-process function. Apply separate credential-target policy after destination approval.

## Expected result
Exit 0 only for an approved public HTTPS destination; JSON decision printed without secrets.

## Failure behavior
Abort connection, record non-secret reason, surface policy failure.

## Blocking
Yes. Validation failure MUST block the connection.