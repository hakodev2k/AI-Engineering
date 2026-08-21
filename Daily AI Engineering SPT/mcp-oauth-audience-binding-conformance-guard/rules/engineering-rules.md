# Engineering Rules

## MUST
- Define exactly one canonical externally visible MCP resource identity per protected MCP endpoint.
- Validate issuer, audience/resource, expiry, and required authorization claims before processing an authenticated MCP request.
- Reject a validly signed token if it was issued for a sibling or unrelated resource.
- Bind authorization, token exchange, and refresh flows to the intended resource according to the selected provider adapter and verify the resulting token audience.
- Treat OAuth UI/consent success as insufficient evidence; verify the token actually delivered to the resource server.
- Use separate upstream credentials when the MCP server calls another protected API.
- Compare inbound and outbound token fingerprints when testing proxies; identical fingerprints MUST fail when passthrough is forbidden.
- Run positive and negative conformance fixtures in CI after auth middleware, proxy, IdP, endpoint, or scope changes.
- Fail closed when canonical resource identity, issuer, or token audience cannot be established.
- Store only sanitized claims or token fingerprints in test evidence.

## MUST NOT
- Accept any token solely because its signature and issuer are valid.
- Use wildcard audience matching as a compatibility workaround.
- Disable audience validation to resolve 401 interoperability failures.
- Forward the client's inbound MCP access token to an upstream API.
- Log full bearer tokens, refresh tokens, authorization codes, client secrets, or private keys.
- Assume `resource` request syntax alone proves safety; the effective token audience must be checked.
- Silently rewrite the canonical public resource to an internal host discovered behind a reverse proxy.
- Retry authorization indefinitely; conformance retries are bounded to policy.

## SHOULD
- Publish RFC 9728 protected-resource metadata for remote MCP endpoints.
- Keep provider-specific request adapters separate from provider-independent audience invariants.
- Test refresh flows independently because resource drift can occur after initial authorization.
- Maintain sibling-resource negative fixtures for every application sharing an issuer.
- Use short-lived test tokens or unsigned local claim fixtures only for deterministic offline validation; use real cryptographic verification in deployed middleware.
- Emit machine-readable verification results suitable for CI policy gates.
