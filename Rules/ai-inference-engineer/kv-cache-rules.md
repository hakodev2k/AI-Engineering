# KV Cache Rules

## Purpose
Control correctness, memory growth, eviction, and reuse of key-value caches in autoregressive inference.

## Scope
KV cache allocation, reuse, paging, eviction, prefix caching, sequence ownership, and lifecycle.

## MUST
- KV cache entries MUST be isolated by request, tenant, model version, and any prompt state required for correctness.
- Reuse policies MUST define exactly which prefixes and model configurations are compatible.
- Cache eviction MUST preserve correctness and produce bounded memory usage.
- Cache accounting MUST be included in capacity and admission decisions.
- Prefix or session reuse MUST be tested for cross-request contamination.

## MUST NOT
- MUST NOT reuse cache state across incompatible model versions or tokenization configurations.
- MUST NOT expose cached prompt state across authorization boundaries.
- MUST NOT allow stale cache metadata to reference freed or reassigned memory.

## SHOULD
- Track cache hit rate, eviction rate, occupancy, and memory efficiency.
- Prefer deterministic invalidation keyed by immutable model/runtime identity.

## Exceptions
Cross-request reuse requires explicit isolation evidence, privacy review where relevant, and approval.

## Verification
Inspect cache keys, isolation tests, eviction tests, memory telemetry, and model-version transition tests.