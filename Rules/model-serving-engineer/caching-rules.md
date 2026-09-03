# Caching Rules

## Purpose
Use caching without violating correctness, privacy, or freshness expectations.

## Scope
Applies to prompt, prefix, KV, response, artifact, and routing caches.

## MUST
- Define cache keys from all inputs that materially affect correctness.
- Define expiration and invalidation behavior for mutable dependencies.
- Isolate cache entries across security or tenant boundaries where data exposure is possible.
- Measure hit rate, latency benefit, memory cost, and stale-result risk.

## MUST NOT
- Cache sensitive outputs across principals without explicit authorization semantics.
- Treat cache hits as valid when model version, adapter, policy, or generation parameters differ materially.
- Introduce cache layers whose invalidation behavior is undefined.

## SHOULD
- Prefer deterministic cacheability rules that can be tested.
- Bound cache memory and eviction impact under peak load.

## Exceptions
Cross-request reuse of sensitive or context-dependent state requires explicit threat review, evidence, and approval.

## Verification
Inspect key construction, isolation tests, invalidation tests, hit-rate metrics, memory pressure, and security review evidence.