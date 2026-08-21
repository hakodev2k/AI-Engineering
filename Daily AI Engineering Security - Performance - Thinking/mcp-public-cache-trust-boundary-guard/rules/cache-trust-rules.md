# Cache Trust Rules

- A client or gateway MUST treat `cacheScope: public` as a cacheability hint, not as proof that cross-authorization reuse is safe.
- Shared caching MUST require a locally trusted server identity and an allowlisted method/policy.
- `cacheScope: private` MUST remain bound to the same authorization context.
- Cache keys MUST include server identity, endpoint, negotiated protocol version, method, schema/representation version, and policy version.
- Authorization tokens MUST NOT be stored in cache metadata or logs; use a one-way context digest when needed.
- Unknown, changed, or ambiguous server identity MUST result in `NO_STORE` or private caching.
- Unexpected tool/prompt/resource manifest changes SHOULD trigger quarantine until verified.
- A cache hit MUST be revalidated against current identity, policy, and protocol before exposure to the model.
- Identity, protocol, policy, or schema changes MUST invalidate affected entries.
- Stale-on-error MUST NOT override a security invalidation or quarantine decision.
- A failed integrity check MUST purge the suspect entry and block completion of the cache hit.
- Security remediation MUST NOT disable authentication or broaden sharing to restore availability.
- Dangerous purge/config changes beyond the scoped cache MUST require human approval.