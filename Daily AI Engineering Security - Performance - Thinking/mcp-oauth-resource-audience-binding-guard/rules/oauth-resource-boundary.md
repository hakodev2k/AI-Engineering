# Rules: OAuth Resource Boundary

- MCP clients MUST identify the intended protected resource using the authorization mechanism required by the current MCP specification.
- MCP servers MUST validate that an accepted token is intended for that exact server/resource.
- Issuer/signature validity MUST NOT be treated as sufficient authorization without resource/audience validation.
- Shared audiences across independently administered deployments MUST NOT be used unless the trust model explicitly makes them one protected resource.
- MCP servers MUST NOT forward the inbound MCP bearer token unchanged to an upstream API.
- Upstream API credentials MUST be separately obtained and scoped for that upstream resource.
- Accepted scopes MUST be a subset of the configured allowlist.
- Raw bearer tokens, refresh tokens and client secrets MUST NOT be committed, persisted in test fixtures, or printed by verification tooling.
- Authorization-policy ambiguity MUST fail closed.
- Production changes SHOULD have independent security review and negative replay tests.