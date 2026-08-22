# OAuth Boundary Rules

- Protected MCP requests **MUST** validate token signature/introspection result, issuer, expiry, canonical audience/resource, and tool-required scopes before tool logic runs.
- A token valid for another resource **MUST NOT** be accepted because its issuer or subject is trusted.
- Inbound bearer tokens **MUST NOT** be copied into downstream `Authorization` headers.
- Downstream calls requiring authentication **MUST** use a credential whose provenance is `service_client`, `token_exchange`, `managed_identity`, or another explicitly approved independent mechanism.
- Upstream credential acquisition failure **MUST NOT** fall back to the inbound client token.
- Authorization failures **MUST** fail closed for protected tools.
- Logs **MUST NOT** contain raw bearer tokens. Evidence **MUST** use one-way fingerprints or claim summaries.
- High-impact tool scope changes **MUST** receive human security review.
- Shared HTTP middleware **SHOULD** strip inbound `Authorization` before constructing outbound requests unless the outbound target is the same protected resource and policy explicitly requires it.
- Security verification **MUST** include wrong-audience, missing-scope, expired-token, token-passthrough, and unavailable-upstream-credential cases.
