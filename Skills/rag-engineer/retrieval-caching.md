# Retrieval Caching

## Purpose
Cache expensive retrieval work safely while controlling staleness, authorization leakage, and invalidation complexity.

## When to use
Use when repeated queries or expensive ranking materially affect latency/cost and freshness requirements allow reuse.

## Inputs
Query distribution, authorization context, corpus update rate, cache backend, latency/cost baseline, freshness SLA.

## Context to inspect
Inspect tenant boundaries, normalized query behavior, index versions, ACL changes, hit rates, result determinism, and invalidation signals.

## Core knowledge
Cache keys must include every dimension that changes permitted or correct results. Semantic caching broadens reuse but increases false-match risk. Invalidation is part of correctness.

## Procedure
1. Identify cacheable stage and expected reuse.
2. Define correctness and freshness tolerance.
3. Construct keys from query, scope, authorization context, filters, and relevant versions.
4. Choose TTL and invalidation triggers.
5. Bound cache size and eviction policy.
6. Prevent sensitive payload leakage through shared caches.
7. Instrument hit rate, stale hits, latency savings, and errors.
8. Test source updates and permission revocations.
9. Evaluate semantic matching thresholds separately if used.
10. Disable caching when benefit is negligible or correctness risk is high.

## Decision points
Exact-key caching is safer; semantic caching may improve hit rate for paraphrases but requires strong evaluation. Version-keying simplifies invalidation at the cost of cold starts.

## Common failure patterns
Missing tenant in key; stale ACL results; caching errors indefinitely; no index-version component; semantic cache returning a nearby but different intent.

## Verification
Run isolation, update, revocation, expiry, and hit/miss tests and quantify net latency/cost benefit.

## Expected output
A bounded cache design with explicit correctness and invalidation semantics.

## Stop conditions
Stop when authorization-sensitive results cannot be safely partitioned.