# Cache-Aware Routing

## Purpose
Use prompt, response, prefix, semantic, and provider-side caches safely as routing signals to reduce latency and cost without returning stale or unauthorized content.

## When to use
Use when the platform supports deterministic cache keys, semantic caches, provider prompt caching, shared prefixes, or tenant-local response reuse.

## Inputs
Cache architecture, key design, tenant boundaries, freshness requirements, model/version identity, prompt prefixes, token costs, hit rates, and invalidation rules.

## Preconditions
Cache isolation and invalidation semantics must be understood before routing decisions depend on cache state.

## Context to inspect
Gateway cache, provider cache capabilities, prompt templates, model aliases, RAG freshness, tenant scoping, encryption, TTLs, and cache telemetry.

## Core knowledge
Caching can change the optimal route because a nominally more expensive model may be cheaper or faster on a cache hit. However, semantic reuse can violate correctness or privacy if cache keys ignore tenant, policy, model version, or dynamic context.

## Procedure
1. Identify cacheable workload classes.
2. Define tenant-safe and policy-safe cache boundaries.
3. Include model, prompt, schema, and relevant context versions in cache identity.
4. Measure hit rate and effective latency/cost by route.
5. Expose cache eligibility as a routing signal.
6. Prefer cached routes only when output validity is equivalent.
7. Define freshness and invalidation for dynamic data.
8. Prevent cache state from bypassing safety or authorization checks.
9. Monitor stale-hit and cross-boundary risks.
10. Test invalidation during model and prompt changes.

## Decision points
Use exact/prefix caching when correctness requires strict identity. Use semantic caching only for workloads where approximate equivalence is defined and verified. Keep user- or tenant-specific content isolated.

## Common failure patterns
Missing model version in keys, shared caches across tenants, stale RAG answers, counting provider cache assumptions as guaranteed hits, and routing solely for cache efficiency.

## Verification
Tests confirm cache hits never cross policy boundaries and route decisions remain correct after invalidation, model change, and tenant separation.

## Expected output
A cache-aware routing policy, cache-key contract, invalidation rules, and measured cost/latency impact.

## Stop conditions
Stop when cache isolation, freshness, or model-version semantics cannot be proven.