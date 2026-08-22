# Cache Performance Rules
## Purpose
Use caching only where it improves measured system behavior without unsafe semantics.
## Scope
Application, distributed, CDN, query, and object caches.
## MUST
- Define cache key, ownership, TTL, invalidation, consistency, and failure behavior.
- Measure hit rate, latency benefit, memory/cost impact, and origin load.
- Protect origins from cache stampedes where risk exists.
## MUST NOT
- Cache sensitive data without appropriate isolation and access controls.
- Introduce caching as a substitute for understanding the bottleneck.
## SHOULD
- Prefer bounded caches and observable eviction behavior.
## Exceptions
Immutable content may use simplified invalidation with documented guarantees.
## Verification
Inspect cache metrics, correctness tests, failure tests, origin load, and configuration.