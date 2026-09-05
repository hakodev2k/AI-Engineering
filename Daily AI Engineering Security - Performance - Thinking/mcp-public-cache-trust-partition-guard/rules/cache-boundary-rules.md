# MCP Cache Boundary Rules

1. A remote server's `cacheScope` hint **MUST NOT** be the sole authority for local cache admission.
2. Authenticated, tenant-scoped, user-scoped, credential-dependent, or permission-sensitive results **MUST NOT** use a shared public cache unless a reviewed local policy proves the result globally invariant.
3. Instruction-bearing server metadata **MUST NOT** be admitted to a shared public cache by default.
4. Server-controlled natural-language instructions **MUST** remain marked as untrusted content and **MUST NOT** be promoted verbatim into a trusted system-policy channel.
5. Sensitive private entries **MUST** include all required partition fields in the cache key.
6. Unknown sensitivity **MUST** fail closed to no-cache/private behavior.
7. Cache keys **MUST NOT** contain raw credentials or secrets; use stable non-secret partition identifiers.
8. TTLs **SHOULD** be bounded according to metadata volatility and incident-recovery requirements.
9. Cross-user and cross-tenant negative tests **MUST** run before enabling a shared cache path.
10. Cache-hit optimization **MUST NOT** override authorization or content-trust boundaries.
11. Security exceptions **MUST** record owner, scope, rationale, approval, and expiry.
12. The implementing agent **MUST NOT** be the only verifier for a change that expands cache sharing.