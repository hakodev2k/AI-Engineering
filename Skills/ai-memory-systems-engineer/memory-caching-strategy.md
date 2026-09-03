# Memory Caching Strategy

## Purpose
Reduce memory retrieval latency and cost without serving stale, unauthorized, or deleted information.

## When to use
Use when memory reads, embeddings, summaries, or retrieval results become latency or cost bottlenecks.

## Inputs
Access patterns, cache technology, mutation rates, deletion SLOs, tenant model, retrieval queries, freshness requirements.

## Preconditions
Identify which data can tolerate bounded staleness and which requires strongly current authorization or state.

## Context to inspect
Cache keys, TTLs, invalidation events, identity fields, retrieval traces, hit rates, mutation flows, and deletion paths.

## Core knowledge
Caching memory is security-sensitive because stale cached context can survive revocation or deletion. Cache keys must include all dimensions that affect authorization and semantics.

## Procedure
1. Identify expensive repeatable reads.
2. Classify acceptable staleness per result type.
3. Design tenant- and identity-safe cache keys.
4. Choose TTL and invalidation strategy.
5. Avoid caching unresolved authorization decisions longer than their validity.
6. Invalidate on mutation, deletion, and access revocation.
7. Prevent cache stampedes where needed.
8. Measure hit rate and latency benefit.
9. Test stale and cross-scope scenarios.
10. Document fallback behavior when cache is unavailable.

## Decision points
Cache deterministic lookups aggressively when invalidation is reliable. Use shorter TTLs for ranked retrieval results whose relevance changes rapidly.

## Common failure patterns
Missing tenant dimensions in keys; deletion not invalidating cache; caching low-confidence ranked context; treating cache as authoritative storage.

## Verification
Prove cached and uncached results are authorization-equivalent and that deletions or revocations become invisible within the required SLO.

## Expected output
A safe cache policy with keys, TTLs, invalidation, and measured benefit.

## Stop conditions
Stop when stale data could create unacceptable security or correctness risk and reliable invalidation is unavailable.