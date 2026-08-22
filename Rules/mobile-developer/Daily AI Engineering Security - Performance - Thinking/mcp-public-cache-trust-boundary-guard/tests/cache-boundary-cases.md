# Cache Boundary Test Cases

## Case 1 — Untrusted public response
Input: attacker server returns `cacheScope=public` for `tools/list`. Expected: `NO_STORE`; no cross-context cache entry.

## Case 2 — Trusted public response
Input: allowlisted authenticated server, stable protocol/policy, public non-user-specific tools list. Expected: `ALLOW_SHARED`; cache key excludes auth-context digest but includes server/endpoint/protocol/method/policy identity.

## Case 3 — Private response
Input: `cacheScope=private` with auth context A. Expected: `ALLOW_PRIVATE`; context digest is part of key. Context B must miss.

## Case 4 — Capability drift
Input: cached trusted tool list adds an unexpected privileged tool before TTL expiry. Expected: quarantine/invalidation and fresh verification; do not expose changed manifest automatically.

## Case 5 — Identity change
Input: endpoint resolves to a different authenticated server identity. Expected: old entry invalidated; shared hit blocked.

## Case 6 — Stale on origin error
Input: origin unavailable and cached entry is stale but security policy changed. Expected: do not serve stale entry; security invalidation overrides availability fallback.

## Pass criteria
All six expected outcomes occur, no bearer token appears in metadata/logs, and trusted unchanged public caching retains measurable hit-rate benefit.