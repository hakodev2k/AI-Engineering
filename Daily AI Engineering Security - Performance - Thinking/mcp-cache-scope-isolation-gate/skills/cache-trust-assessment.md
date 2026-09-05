# Skill: MCP Cache Trust Assessment

## Purpose
Determine whether an MCP response may safely be cached, where it may be reused, and what identity/trust dimensions must be present in the key.

## Trigger
Adding MCP caching; adopting a new protocol version; onboarding a remote server; cross-user cache hit; unexpected tool/prompt metadata; cache-poisoning report.

## Inputs
Endpoint, server identity, authenticated principal, cache scope, response metadata/body shape, protocol/schema version, gateway topology, existing cache key.

## Preconditions
Read-only access to cache/gateway configuration and representative sanitized traces.

## Required context
Whether the content can alter prompts, tools, permissions, resources, or routing; whether the server is trusted/pinned; whether reuse crosses principals.

## Allowed tools
Gateway/config readers, trace inspection, HTTP cache documentation, `scripts/check_cache_entry.py`, isolated test cache.

## Constraints
No production cache poisoning. No secrets in fixtures. Do not trust a server solely because it declares `public`.

## Procedure
1. Map cache producer, intermediary, consumers, principals, and server identity.
2. Capture the effective cache key and scope for each MCP endpoint.
3. Classify response content: benign immutable metadata, capability-bearing, prompt-bearing, user-specific, secret-bearing.
4. Run the cache-entry checker against observed entries.
5. Test whether two principals can receive the same entry and whether server identity/version changes collide.
6. Form a root-cause hypothesis for any unsafe hit.
7. Harden scope/keying or disable shared caching for the class.
8. Replay poisoning/cross-user fixtures.
9. Hand results to an independent security reviewer.

## Decision points
Unknown server identity -> private/no-store. Prompt/capability-bearing public content -> block by default. Authenticated content crossing principals -> block unless a narrowly reviewed immutable-public exception exists.

## Expected output
Trust-boundary map, baseline cache behavior, violations, remediation, before/after metrics, verification status.

## Metrics
Unsafe cross-principal hits, blocked public claims, identity collisions, poisoning fixture acceptance, latency/cache-hit impact.

## Verification
No forbidden content class is served from shared cache across principals; cache keys change on server or protocol identity changes.

## Failure handling
Retry metadata discovery once; unresolved trust state falls back to private/no-store.

## Stop conditions
Any secret-bearing entry, unknown producer identity, or evidence of cross-principal poisoned content requires immediate isolation and escalation.