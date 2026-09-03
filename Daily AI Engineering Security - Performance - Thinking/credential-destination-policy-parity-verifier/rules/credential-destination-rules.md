# Rules: Credential Destination Enforcement

- A credential-consuming adapter with a user-configurable endpoint **MUST** enforce the credential destination policy.
- Destination authorization **MUST** occur before secret materialization, header/query attachment, OAuth token attachment, or request transmission.
- Host validation **MUST** use a canonical parsed destination, not substring matching.
- Redirects **MUST** be revalidated against the destination policy before credentials follow them.
- Use-only shared credentials **MUST NOT** be disclosed through endpoint overrides, MCP targets, AI provider base URLs, GraphQL endpoints, or alternate adapters.
- Every applicable adapter **MUST** have a passing synthetic `disallowed_destination` negative test.
- Tests **MUST NOT** contain production credentials.
- A new adapter **MUST NOT** ship until it appears in the parity inventory or is explicitly proven non-applicable.
- Network egress filtering **SHOULD** be used as defense-in-depth but **MUST NOT** substitute for credential-specific destination authorization.
- A failing parity check **MUST** block security verification; teams **MUST NOT** weaken the allowlist to obtain a pass.