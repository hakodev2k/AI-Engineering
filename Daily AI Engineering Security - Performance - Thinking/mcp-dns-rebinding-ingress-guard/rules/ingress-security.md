# Rules: MCP HTTP Ingress Security

- MCP HTTP/SSE deployments MUST validate `Host` against an explicit allowlist.
- Browser-originated requests MUST validate `Origin` against an explicit allowlist.
- Wildcard `Access-Control-Allow-Origin` or equivalent wildcard origin policy MUST NOT be used for local/private MCP endpoints.
- Local-only MCP servers MUST bind to loopback unless a reviewed network-exposure requirement exists.
- Loopback binding MUST NOT be treated as a substitute for `Host`/`Origin` validation.
- Consequential tools MUST require request authentication or an equivalently strong authorization boundary.
- Server-held credentials MUST NOT be sent to destinations selected solely from untrusted request content.
- Reverse proxies SHOULD preserve enough original host/origin information for downstream validation or enforce the complete policy themselves.
- Deployment MUST be blocked when the runtime SDK/server version is known vulnerable and compensating controls are not verified.
- Security logs MUST record decision reason codes and MUST NOT record authentication secrets.
