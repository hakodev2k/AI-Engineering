# Rules — OAuth Recovery

## MUST
- MUST classify authorization failures separately from generic tool/runtime failures.
- MUST reload persisted credential state before refresh and again after acquiring a refresh lock.
- MUST serialize refresh transactions per credential family or account/server tuple.
- MUST preserve an existing durable refresh token when a successful refresh response omits `refresh_token`, unless the provider explicitly revokes it.
- MUST persist rotated refresh tokens atomically before releasing the refresh lock.
- MUST invalidate or rehydrate live MCP transport/session auth state after credential replacement.
- MUST cap automatic recovery to one refresh transaction and one post-recovery retry per original tool invocation.
- MUST redact tokens, authorization codes, client secrets, and raw Authorization headers from logs.
- MUST emit a sanitized reason and recovery state for observability.
- MUST require explicit reauthorization when refresh credentials are absent, revoked, expired, or repeatedly rejected.

## MUST NOT
- MUST NOT retry `invalid_grant`, 401, or authorization-required indefinitely.
- MUST NOT overwrite durable credentials with `null`/missing fields from a partial refresh response.
- MUST NOT log raw token values even at debug level.
- MUST NOT treat `-32603 Internal error` alone as proof of an OAuth failure.
- MUST NOT refresh concurrently from multiple sessions when refresh-token rotation is enabled.
- MUST NOT downgrade TLS, PKCE, audience/resource validation, or token rotation to improve availability.
- MUST NOT silently broaden OAuth scopes during recovery.
- MUST NOT reuse an old refresh token after a successful rotation has been persisted.

## SHOULD
- SHOULD store a monotonic credential version or safe fingerprint to detect stale live sessions.
- SHOULD use compare-and-swap/transactional persistence where available.
- SHOULD map provider/OAuth errors to normalized states: `refreshable`, `stale_session`, `reauth_required`, `registration_required`, `unknown`.
- SHOULD expose recovery metrics without secret material.
- SHOULD test partial token responses because OAuth servers may legally omit a new refresh token.
- SHOULD make reauthorization visible instead of presenting a generic MCP tool failure.
