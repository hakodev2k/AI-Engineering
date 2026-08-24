# Caching Strategy

## Purpose
Introduce caching only where it improves latency, throughput, or dependency protection without violating correctness.

## When to use
Use after identifying repeated expensive reads or dependency pressure. Do not cache merely because a cache is available.

## Inputs
Access patterns, latency targets, freshness requirements, source-of-truth behavior, data size, failure tolerance.

## Context to inspect
Current query/API latency, hit candidates, invalidation events, tenancy/security boundaries, memory limits, and deployment topology.

## Core knowledge
Cache-aside, read-through/write-through concepts, TTL, invalidation, stampede prevention, negative caching, local vs distributed caches, and consistency trade-offs.

## Procedure
1. Measure the uncached bottleneck.
2. Define correctness and freshness bounds.
3. Choose cache scope and key design.
4. Define population, expiration, and invalidation.
5. Prevent stampedes with bounded coalescing/jitter where needed.
6. Handle cache failure as an explicit dependency mode.
7. Protect tenant/user isolation.
8. Measure hit rate, latency, memory, and source load.

## Decision points
Prefer local caches for process-local reusable data; distributed caches for shared state across instances. Prefer invalidation when authoritative change events are reliable; otherwise use bounded TTLs.

## Common failure patterns
Stale authorization data, key collisions, cache stampedes, infinite TTLs, caching errors indefinitely, oversized values, and treating cache as source of truth.

## Verification
Validate correctness under misses, stale entries, invalidation, cache outage, concurrent refresh, and deployment scaling; compare measured hit rate and latency.

## Expected output
A documented cache policy with measurable benefit and bounded staleness.

## Stop conditions
Stop when freshness semantics are undefined or cached data would weaken a security boundary.