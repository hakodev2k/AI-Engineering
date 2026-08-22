# OAuth Boundary Rules

- Protected MCP requests **MUST** pass cryptographic token verification before this boundary check.
- The server **MUST** have one explicit canonical resource identifier.
- The token audience **MUST** include that resource identifier.
- A token issued only for another resource **MUST NOT** be accepted even when signature and issuer are valid.
- The inbound MCP bearer token **MUST NOT** be forwarded unchanged to an upstream API.
- Upstream API calls **MUST** use a separately issued credential or standards-compliant token exchange appropriate to that resource.
- Required scopes **MUST** be enforced in addition to audience/resource validation.
- Raw bearer tokens, refresh tokens, client secrets and authorization codes **MUST NOT** be logged.
- Security checks **MUST** run before protected tool handlers.
- Missing or ambiguous audience/resource information **MUST** fail closed.
- Resource canonicalization **SHOULD** follow RFC 8707/MCP SDK behavior and remove URI fragments.
- Dangerous permission/scope expansion **MUST** require explicit human approval and updated tests.
- Test suites **MUST** include valid-signature/wrong-audience fixtures, not only malformed/expired tokens.