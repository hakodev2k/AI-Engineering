# Rules: MCP OAuth Boundaries

- MCP ingress MUST use a maintained OAuth/JWT validator for cryptographic validation before policy evaluation.
- The server MUST compare the token audience/resource against the configured canonical MCP resource.
- A token with missing or mismatched audience MUST be rejected when `require_audience` is enabled.
- Issuer validation MUST be performed against an explicit trusted issuer set.
- Required scopes MUST be checked independently from audience.
- Raw access tokens and refresh tokens MUST NOT appear in logs, traces, test snapshots, or agent context.
- Audit logs SHOULD use one-way token fingerprints only when correlation is necessary.
- The inbound MCP bearer token MUST NOT be forwarded unchanged to an upstream protected API.
- Upstream APIs MUST use a separately obtained credential, token exchange result, or service identity appropriate for that resource.
- Outbound protected hosts MUST be explicitly allowed by policy.
- A change to canonical resource URI, issuer, scope requirements, or upstream identity path MUST rerun the security regression workflow.
- Test fixtures MUST include correct audience, wrong audience, missing audience, and passthrough attempts.
- Security failures MUST fail closed; retrying with weaker validation is prohibited.
- Dangerous production actions MUST require human approval even after token validation succeeds.