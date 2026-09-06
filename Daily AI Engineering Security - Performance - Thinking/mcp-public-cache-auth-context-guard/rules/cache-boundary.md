# Cache Boundary Rules

## Scope
These rules apply to MCP discovery, list, and read responses considered for caching by clients, gateways, proxies, or agent platforms.

## Enforceable rules
- A cache admission decision **MUST** distinguish protocol validity from authorization safety.
- An authenticated, permission-filtered, tenant-specific, user-specific, feature-flag-specific, or otherwise personalized response **MUST NOT** be admitted to a shared/public cache.
- A private cache entry **MUST** be keyed by server identity, method, negotiated protocol version, request-relevant parameters, and a non-secret authorization-context digest.
- Raw bearer tokens, cookies, API keys, refresh tokens, or secrets **MUST NOT** be stored in cache keys, logs, evidence artifacts, or test fixtures.
- A malformed, missing, unknown, or ambiguous cache scope **MUST** fail closed to private/no-cache behavior. It **MUST NOT** silently become public.
- A response from an untrusted or newly changed server that contains model-visible instructions, tool descriptions, prompt text, or resource content **MUST NOT** be promoted to a shared cache without an explicit trust decision.
- Public cache admission **MUST** require evidence that the response is invariant across authorization contexts for the configured endpoint and method.
- Per-primitive authorization **MUST** still execute at the server. Cache policy **MUST NOT** substitute for authorization.
- Cache invalidation **MUST** include server/tool metadata version or response digest so stale poisoned entries can be removed deterministically.
- Cache-hit telemetry **MUST** record a non-secret cache-key fingerprint, server identity, method, scope, and admission-policy version.
- Security verification **MUST** test at least two distinct synthetic authorization contexts and prove that private entries never cross contexts.
- Any change that broadens `private` to `public` **MUST** require independent security review and explicit human approval.

## Recommended defaults
- Implementations **SHOULD** default authenticated endpoints to private caching.
- Implementations **SHOULD** use `ttlMs=0` or no-cache when invariance cannot be demonstrated.
- Implementations **SHOULD** retain the previous safe policy when a metadata refresh fails.

## Completion block
A run is blocked if any public candidate is personalized, any private key lacks authorization binding, any secret appears in an artifact, or cross-context tests produce a hit.
