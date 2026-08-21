# Rules — MCP OAuth Resource Boundary

- MCP clients MUST send the canonical MCP resource URI in the RFC 8707 `resource` parameter for both authorization and token requests when required by the active MCP authorization specification.
- The authorization-request resource and token-request resource MUST match the intended MCP server resource.
- MCP servers MUST validate token issuer, expiry/not-before where applicable, audience/resource binding, and required scope/role before processing protected requests.
- Signature validity MUST NOT be treated as sufficient authorization.
- Tokens whose audience does not include the configured MCP resource MUST be rejected.
- Unknown or ambiguous audience semantics MUST NOT be silently accepted.
- Inbound MCP bearer tokens MUST NOT be forwarded unchanged to downstream resource servers.
- Downstream APIs SHOULD use a separately issued token appropriate to their own resource/audience.
- Access tokens, refresh tokens, authorization codes, client secrets, and PKCE verifiers MUST NOT be written to ordinary logs or test artifacts.
- Negative tests for wrong audience, wrong issuer, expired token, and insufficient privilege MUST run before connector enablement.
- A provider/client incompatibility MUST NOT be solved by disabling audience validation.
- Protected-resource metadata changes SHOULD invalidate prior conformance evidence and trigger re-verification.
- Security test failures MUST block release/enablement until remediated or explicitly risk-accepted by an authorized human outside the implementing agent.
- The implementing agent MUST NOT be the sole verifier for authentication-boundary changes.