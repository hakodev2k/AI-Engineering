# Rules: MCP HTTP Origin/Host Boundary

1. An MCP Streamable HTTP server **MUST** define an explicit allowed-host policy.
2. A present `Origin` header **MUST** be validated before MCP request dispatch.
3. An invalid present `Origin` **MUST** be rejected; the application **MUST NOT** continue to tool handling.
4. Allowed origins **MUST** be exact scheme/host/port tuples when a non-default port is used.
5. `*` **MUST NOT** be used as an allowed origin for local/private MCP endpoints.
6. Local-only MCP servers **SHOULD** bind to loopback rather than `0.0.0.0`.
7. Non-loopback MCP HTTP servers **MUST** require authentication unless a documented, independently reviewed exception exists.
8. Host/Origin enforcement **MUST** be tested at the effective deployed boundary, not inferred only from SDK version.
9. Reverse proxies and CORS middleware **MUST NOT** silently broaden the SDK policy.
10. Missing `Origin` handling **MUST** be explicit. If allowed for non-browser clients, the server **MUST** still enforce Host and authentication/bind requirements.
11. Security tests **MUST** include at least one foreign Host and one foreign Origin case.
12. A failed negative test **MUST** block a Verified status.
13. Security controls **MUST NOT** be weakened to improve compatibility or latency without explicit human approval and replacement controls.
14. Logs **SHOULD** record rejection reason classes without recording bearer tokens, cookies, or secrets.
