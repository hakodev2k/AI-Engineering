# Rules: MCP Outbound Network Boundary

- All LLM-influenced URL fields MUST be treated as untrusted input.
- Network requests MUST validate scheme, host, port, and resolved IP before connection.
- Redirect destinations MUST be revalidated before following.
- Link-local, loopback, private, multicast, and unspecified addresses MUST be blocked by default.
- Credentials MUST NOT be attached before destination authorization succeeds.
- Internal-network exceptions MUST be explicit, narrow, and security-reviewed.
- Read-only tool mode MUST NOT be treated as a credential boundary.
- Logs MUST NOT contain tokens, cookies, authorization headers, or secret query parameters.
- DNS resolution failures MUST fail closed after at most one retry.
