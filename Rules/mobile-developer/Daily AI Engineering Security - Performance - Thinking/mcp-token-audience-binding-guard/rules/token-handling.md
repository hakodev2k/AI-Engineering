# Rules: MCP Token Handling

- Protected MCP actions MUST validate that the presented token is intended for the canonical MCP resource/audience.
- Required issuer validation MUST fail closed when issuer metadata is missing or does not match policy.
- Required active-state validation MUST fail closed when active state is missing, unknown, or false.
- MCP clients SHOULD request tokens using the canonical MCP resource indicator defined by the deployment.
- An MCP server MUST NOT pass the inbound client bearer token unchanged to a downstream API.
- Downstream API calls MUST use credentials separately issued for that downstream resource.
- Operation scopes MUST be checked at action time and MUST be the minimum required for that operation.
- Missing scope configuration MUST NOT silently grant access to privileged operations.
- Raw access tokens, refresh tokens, authorization headers, client secrets, or bearer material MUST NOT be written to guard inputs, logs, traces, prompts, or test fixtures.
- Authentication success MUST NOT be treated as sufficient authorization for a protected tool.
- Audience/issuer checks MUST NOT be disabled merely to restore compatibility after an integration failure.
- High-impact authorization changes SHOULD be independently reviewed and security-tested before release.
- Security retries MUST be bounded to two remediation attempts unless new evidence identifies a distinct cause.
