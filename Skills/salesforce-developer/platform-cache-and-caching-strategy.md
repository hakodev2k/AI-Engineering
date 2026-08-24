# Platform Cache and Caching Strategy

## Purpose
Use Salesforce caching deliberately to reduce repeated computation and data access without introducing stale-data correctness defects.

## When to use
Use after measurement shows repeated expensive reads/computation and when bounded staleness is acceptable.

## Inputs
Read frequency, update frequency, latency target, staleness tolerance, cache scope, invalidation events, data sensitivity.

## Context to inspect
Platform Cache partitions, client/LDS caching, static transaction caches, custom metadata, query patterns, update paths, permission boundaries.

## Core knowledge
Caching trades freshness and complexity for latency/resource savings. Transaction-static caches, Platform Cache, and client caches have different scopes and consistency behavior. A cache must never become an authorization bypass.

## Procedure
1. Measure the uncached bottleneck.
2. Define canonical cache key and scope.
3. Set an explicit freshness requirement.
4. Choose transaction, org/session Platform Cache, or client caching based on lifetime.
5. Keep cached payloads compact.
6. Define invalidation or tolerate TTL-based expiry explicitly.
7. Prevent cross-user leakage of permission-sensitive data.
8. Implement cache-miss fallback correctly.
9. Test stale, missing, evicted, and concurrent-update scenarios.
10. Compare limits and latency before/after.

## Decision points
Prefer no cache when data changes frequently or correctness requires immediate consistency. Prefer immutable/configuration caches when values are stable and broadly reusable.

## Common failure patterns
Caching before measuring, user-specific data in org scope, no invalidation strategy, treating cache as durable storage, and caching huge object graphs.

## Verification
Prove correctness on cache miss/hit/expiry, confirm security isolation, and measure actual resource savings.

## Expected output
A bounded caching design with key, scope, TTL/invalidation, fallback, and evidence.

## Stop conditions
Stop when acceptable staleness cannot be defined or cache isolation cannot meet security requirements.