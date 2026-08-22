# Rules — MCP Authorization Boundary

- Authentication middleware MUST cryptographically verify token integrity, expiry, and issuer before claims reach this gate.
- Unverified claims MUST NOT be trusted, logged as verified, or used for authorization.
- The MCP canonical resource URI MUST be configured centrally and MUST NOT be inferred from untrusted request headers.
- Resource matching MUST be exact by default.
- Allowed issuers and audiences MUST be explicit allowlists.
- A token valid for one MCP resource MUST NOT be accepted for another resource merely because the issuer/signature is valid.
- Required scopes MUST be evaluated per operation before tool dispatch.
- Missing scope MUST fail closed or enter an explicit step-up authorization path; it MUST NOT silently broaden permissions.
- Raw bearer tokens, refresh tokens, authorization codes, and secrets MUST NOT be logged.
- Gateways MUST NOT forward upstream access tokens to downstream MCP servers unless the downstream resource and audience are explicitly authorized for that token flow.
- Compatibility failures MUST NOT be fixed by disabling audience/resource validation.
- Negative tests for wrong resource, wrong audience, wrong issuer, missing scope, and unverified claims MUST pass before deployment.
- High-impact tool actions SHOULD require an additional policy/human approval layer independent of token validity.
