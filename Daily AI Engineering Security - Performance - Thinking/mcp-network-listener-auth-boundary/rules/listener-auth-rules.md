# Rules: MCP Listener Authentication Boundary

- Network MCP transports **MUST** default to a loopback bind unless wider exposure is explicitly configured.
- Any effective non-loopback listener **MUST** require an inbound caller credential before session establishment or tool invocation.
- A downstream service credential held by the MCP server **MUST NOT** be treated as inbound caller authentication.
- Inbound and downstream credentials **MUST** be distinct in role and **SHOULD** be distinct secret values and rotation scopes.
- Startup **MUST** fail closed when a non-loopback bind is configured without required inbound authentication.
- Deployment verification **MUST** inspect effective reachability after container port publishing, Kubernetes Services/Ingress, and reverse proxies; application bind configuration alone is insufficient.
- HTTP MCP transports **MUST** validate acceptable Host values when exposed beyond a strictly local boundary.
- Browser-reachable deployments **MUST** implement an explicit Origin policy and DNS-rebinding defense; Origin validation alone **MUST NOT** be considered sufficient.
- Authentication checks **MUST** occur before privileged tool execution and before downstream credentials are used.
- Unauthorized requests **MUST** produce a controlled denial without revealing tool results, downstream tokens, or sensitive configuration.
- Tool authority **SHOULD** follow least privilege; read-only mode **SHOULD** be the default where write operations are not required.
- High-impact write/deploy/delete tools **SHOULD** require additional authorization or human approval even after MCP caller authentication.
- Exceptions that expose an unauthenticated listener **MUST NOT** be approved for production use.
