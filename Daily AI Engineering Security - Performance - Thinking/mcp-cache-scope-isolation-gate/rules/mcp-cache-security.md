# MCP Cache Security Rules

1. MCP responses **MUST** default to private isolation or no-store unless public reuse is explicitly approved by local policy.
2. A server-declared `cacheScope: public` **MUST NOT** by itself authorize shared cross-principal caching.
3. Shared-cache keys **MUST** include trusted server identity and protocol/schema version.
4. Private/authenticated entries **MUST** include the authorization principal or an equivalent isolation namespace in the key.
5. Prompt-bearing fields such as server instructions **MUST NOT** enter shared cache by default.
6. Capability-bearing metadata such as tool definitions **MUST NOT** enter shared cache unless the exact endpoint/server/content class is explicitly allowlisted.
7. Secret-bearing or user-specific content **MUST NOT** enter shared cache.
8. Unknown or invalid cache scope **MUST** fail closed to private/no-store behavior.
9. Cache invalidation **MUST** occur when server trust, protocol version, schema version, or authorization policy changes.
10. Performance goals **MUST NOT** justify broadening cache scope without security review and poisoning tests.
11. Cache-hit telemetry **SHOULD** record server ID, endpoint, scope decision, and anonymized isolation namespace without logging secrets.
12. The implementation author **MUST NOT** be the sole verifier of cross-user isolation changes.