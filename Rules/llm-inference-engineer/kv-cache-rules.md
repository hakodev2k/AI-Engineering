# KV Cache Rules

## Purpose
Manage key-value cache memory as a bounded production resource while preserving correctness, isolation, and predictable latency.

## Scope
Applies to KV cache allocation, paging, eviction, prefix reuse, cache sharing, offloading, and multi-tenant isolation.

## MUST
- KV cache capacity MUST be modeled against context length, concurrency, precision, and model architecture.
- Allocation and eviction policies MUST be bounded and observable.
- Prefix or cross-request cache reuse MUST preserve tenant and data-isolation boundaries.
- Cache eviction MUST fail safely and MUST NOT corrupt active request state.
- Cache pressure metrics MUST distinguish allocated, reserved, evicted, and reclaimable capacity where supported.
- Changes to cache layout, compression, or offload MUST be validated for correctness and latency under representative workloads.

## MUST NOT
- MUST NOT share reusable prompt state across security boundaries without explicit proof of isolation.
- MUST NOT depend on optimistic cache hit rates for capacity planning without fallback headroom.
- MUST NOT allow cache growth to trigger uncontrolled device OOM conditions.
- MUST NOT treat cache eviction as harmless when it can materially change latency or throughput.

## SHOULD
- Systems SHOULD prefer predictable cache admission over uncontrolled overcommit.
- Prefix caching SHOULD be used only where workload locality and privacy requirements justify it.

## Exceptions
Exceptions require workload evidence, isolation analysis, memory-risk assessment, rollback, and human approval when data boundaries or production capacity are affected.

## Verification
Inspect memory models, cache metrics, eviction tests, cross-tenant isolation tests, OOM tests, and load-test results across short and long contexts.