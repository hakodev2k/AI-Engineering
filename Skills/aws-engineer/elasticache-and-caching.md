# ElastiCache and Caching

## Purpose
Design Redis/Valkey or Memcached caching that improves latency and resilience without introducing correctness failures.

## When to use
Use for hot reads, sessions, rate limits, transient coordination, expensive computation, or database load reduction.

## Inputs
Data source, freshness tolerance, request rate, object size, eviction behavior, consistency, failover requirements.

## Context to inspect
Cluster mode, replicas, parameter groups, TTLs, memory usage, eviction policy, connection count, encryption, security groups, client libraries.

## Core knowledge
Caches are derived state unless explicitly used as a primary store. TTL, invalidation, stampede protection, failover, and serialization compatibility are design concerns. Network hops can erase gains for cheap operations.

## Procedure
1. Measure uncached latency and backend cost.
2. Define cacheable data and freshness bounds.
3. Choose cache-aside, write-through, or other pattern deliberately.
4. Define keys, TTLs, and versioning.
5. Add request coalescing/jitter for hot keys.
6. Bound client connections and timeouts.
7. Design behavior when cache is unavailable.
8. Configure replication/failover according to data criticality.
9. Monitor hit ratio, evictions, memory, latency, and hot keys.

## Decision points
Use caching only where measured benefit exceeds invalidation and operational complexity. Prefer graceful degradation over making the cache a hard dependency when possible.

## Common failure patterns
No TTL, synchronized expiry storms, cache-as-database accidentally, huge values, unbounded keys, retry storms during failover, and stale authorization data.

## Verification
Load-test with cold/warm caches, fail the cache intentionally, and verify backend protection and freshness guarantees.

## Expected output
Caching policy, failure behavior, sizing, and telemetry plan.

## Stop conditions
Escalate when stale data can violate safety/security or cache loss would cause unrecoverable state.