# Rules: Remote MCP Listener Security

- Remote-capable MCP listeners MUST require authenticated caller identity before session creation or tool dispatch.
- Privileged remote tools MUST have explicit authorization; authentication alone MUST NOT imply access to every tool.
- Local-only MCP services MUST bind to loopback by default.
- An authenticated reverse proxy MUST NOT be considered protective if the backend MCP port is directly reachable around it.
- Browser-reachable HTTP/SSE MCP transports MUST validate Origin or provide an equivalently documented DNS-rebinding defense.
- Server-side credentials MUST NOT be exposed through unauthenticated tool calls.
- Deployment review MUST evaluate effective runtime binding and published ports, not only source defaults.
- Security tests MUST prove an unauthorized request is rejected before tool execution.
- Logs MUST record rejection reason and endpoint identity without recording bearer tokens, cookies, API keys, or upstream secrets.
- Operators MUST NOT weaken authentication, authorization, Origin checks, or network isolation to make integration easier.
- Any exception to remote-listener controls MUST require explicit human approval, expiry, scope, and compensating controls.
- Completion MUST be blocked while a known unauthenticated remote path remains.
