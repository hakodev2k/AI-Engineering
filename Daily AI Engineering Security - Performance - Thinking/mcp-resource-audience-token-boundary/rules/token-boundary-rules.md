# Rules — MCP Token Boundary

- The server MUST validate token signature, temporal claims, issuer, and intended resource/audience before tool execution.
- A signature-valid token with the wrong audience/resource MUST be rejected.
- Required scopes MUST be checked separately from audience/resource.
- The inbound MCP bearer token MUST NOT be forwarded, copied, or reused as the upstream API bearer token.
- Upstream credentials MUST be separately issued for the upstream resource.
- Raw bearer tokens, refresh tokens, authorization codes, and client secrets MUST NOT appear in logs, traces, test snapshots, or error messages.
- Token fingerprints MAY be logged only as non-reversible hashes with minimal claim metadata.
- Authorization failure MUST fail closed.
- Auth failures SHOULD NOT be automatically retried unless the failure is explicitly classified as transient infrastructure failure.
- Production issuer/resource/client configuration changes MUST require explicit human approval.
- Negative fixtures for wrong audience, expired token, missing scope, and passthrough MUST pass before release.
