# Rule — Cache-Scope Security

- Shared-cache admission MUST be a host-side authorization decision; a server's `cacheScope: public` MUST NOT be sufficient by itself.
- Every cache entry MUST bind canonical server identity, MCP method, protocol version, representation discriminator, effective scope, and content digest.
- Private entries MUST bind an authorization-context fingerprint and MUST NOT be returned to a different fingerprint.
- Unknown, ambiguous, or unauthenticated server identity MUST result in `no-store`.
- Public reuse MUST be allowlisted per canonical server identity and method.
- Model-visible server instructions, tool descriptions, prompt templates, and resource metadata SHOULD default to private/no-store unless explicitly reviewed.
- A content/provenance mismatch MUST evict the entry and block serving it.
- Access tokens, cookies, API keys, and raw authorization headers MUST NOT appear in cache keys or audit logs.
- Security policy MUST NOT be weakened to improve hit rate or latency.
- TTL MUST NOT override provenance, tenant isolation, revocation, or list-changed invalidation.
- Changes to the public allowlist SHOULD require human review and a cross-context poisoning test.
- Verification MUST distinguish Implemented, Measured, and Verified; a configuration-only change MUST NOT be reported as verified.
