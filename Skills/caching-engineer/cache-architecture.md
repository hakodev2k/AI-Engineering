# Cache Architecture

## Purpose
Design cache layers that reduce latency and origin load without weakening correctness, operability, or failure isolation.

## When to use
Use when introducing, redesigning, or reviewing application, distributed, CDN, database-adjacent, or edge caching. Do not cache merely because a read is frequent; first establish the performance objective and correctness envelope.

## Inputs
Workload profile, latency SLOs, origin capacity, data ownership, freshness requirements, traffic distribution, failure history, cost constraints.

## Context to inspect
Inspect request paths, authoritative stores, existing caches, consistency assumptions, deployment topology, tenancy boundaries, metrics, and invalidation mechanisms.

## Core knowledge
A cache is a derived copy, not the source of truth. Architecture must account for locality, working-set size, hit ratio, miss cost, freshness, eviction, replication, stampedes, partial failure, and observability. Layering caches can improve locality but multiplies invalidation and diagnosis complexity.

## Procedure
1. Define the user-visible latency and availability objective.
2. Identify the authoritative source and expensive operations.
3. Measure baseline request volume, p50/p95/p99 latency, origin utilization, and reuse distance.
4. Classify data by mutability, sensitivity, size, and acceptable staleness.
5. Select cache placement: process-local, shared distributed, CDN/edge, or layered.
6. Define keys, TTL policy, invalidation ownership, and miss behavior.
7. Estimate memory, bandwidth, replication, and origin load under normal and cold-cache conditions.
8. Design stampede protection and bounded fallback behavior.
9. Define consistency semantics explicitly.
10. Add metrics for hits, misses, evictions, fill latency, errors, memory, and origin amplification.
11. Test cold starts, node loss, network partition, mass expiry, and rollback.
12. Document operational limits and ownership.

## Decision points
Prefer local caches for ultra-low latency and disposable state when per-node divergence is acceptable. Prefer shared caches when cross-node reuse and coordinated state matter. Use edge caching for geographically distributed cacheable responses. Avoid extra layers when invalidation complexity exceeds measured benefit.

## Common failure patterns
Caching without a measured bottleneck; treating cache as durable storage; unbounded keys; synchronized expiry; hidden tenant leakage; ambiguous invalidation ownership; retry storms on cache failure; assuming a high hit ratio guarantees lower tail latency.

## Verification
Compare baseline and post-change latency, origin load, error rate, hit ratio, memory, and cold-cache behavior. Run failure tests and verify stale data never exceeds the declared freshness envelope.

## Expected output
A documented cache topology, correctness contract, capacity estimate, failure behavior, instrumentation plan, and verified performance evidence.

## Stop conditions
Stop if data ownership is unknown, freshness requirements conflict, sensitive-data boundaries are unresolved, or safe origin behavior during cache loss cannot be demonstrated.