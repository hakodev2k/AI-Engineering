# Cache Isolation Rules

## Security invariants
- MCP cache metadata from a server **MUST** be treated as untrusted input until local policy validates it.
- A response marked `public` **MUST NOT** be reused across authorization contexts unless the server is explicitly present in `share_trusted_servers` and all shared-key requirements pass.
- Unknown, missing, malformed, or unsupported cache scope **MUST** be rejected when `reject_unknown_scope` is enabled.
- A `public` response from an untrusted server **MUST** be downgraded to `private` when policy allows downgrade; otherwise it **MUST** be rejected.
- Private entries **MUST** include an authorization-context fingerprint in the effective cache key.
- Authorization fingerprints **MUST NOT** contain raw access tokens, cookies, secrets, or reversible credentials.
- Every admitted payload **MUST** have a SHA-256 integrity value computed locally from canonical bytes.
- Cache lookup **MUST** verify expiry, server origin, protocol version, request identity, scope, and payload integrity before returning content.
- A change in server origin, negotiated protocol version, relevant trust policy, or authorization context **MUST** invalidate incompatible entries.
- Cached tool, prompt, resource, or instruction metadata **MUST NOT** acquire greater tool authority than a fresh response would have.
- Cache provenance **MUST** be logged with non-secret identifiers sufficient to distinguish private versus cross-authorization reuse.
- Operators **MUST NOT** weaken authorization isolation merely to improve cache hit rate.

## Recommended controls
- Gateways **SHOULD** default all MCP caching to private until a server is explicitly reviewed for shared reuse.
- Shared TTLs **SHOULD** be shorter than private TTLs unless stronger origin/integrity mechanisms exist.
- Security regression tests **SHOULD** include tenant A poisoning followed by tenant B lookup.
- Trust-policy changes **SHOULD** flush affected shared entries immediately.

## Completion gate
A package verification run fails if any adversarial fixture produces a cross-authorization hit without explicit sharing authorization, if raw credentials appear in a cache key/log, or if an integrity mismatch is returned as a hit.
