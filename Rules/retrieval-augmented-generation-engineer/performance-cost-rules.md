# Performance and Cost Rules

## Purpose
Control latency, throughput, capacity, and spend across retrieval and generation without trading away correctness or security.

## Scope
Applies to query processing, retrievers, vector/keyword stores, rerankers, embedding inference, context assembly, model calls, caching, and concurrency.

## MUST
- End-to-end and stage-level latency budgets MUST be defined for production-critical request paths.
- Performance changes MUST be supported by before/after measurements under representative workload.
- Cost analysis MUST include embedding, storage, retrieval, reranking, model tokens, network, and background indexing where material.
- Timeouts, queue limits, concurrency limits, and backpressure MUST be explicit for external and internal dependencies.
- Caching MUST preserve authorization, freshness, and corpus-version correctness.
- Capacity testing MUST include realistic corpus size, query mix, filters, and peak concurrency.
- Expensive fallbacks MUST be bounded so dependency degradation cannot create uncontrolled cost amplification.

## MUST NOT
- Relevance, grounding, or authorization checks MUST NOT be removed solely to reduce latency or cost.
- Performance improvement MUST NOT be claimed from synthetic microbenchmarks alone when production behavior differs materially.
- Unbounded retries, fan-out, candidate counts, or context growth MUST NOT be permitted in production.
- Cache entries MUST NOT cross security principals unless equivalence is proven by policy.

## SHOULD
- Prefer the simplest retrieval/reranking pipeline that meets measured quality objectives.
- Track p50, p95, and p99 latency plus cost per successful request.
- Use load shedding and graceful degradation before saturation causes cascading failure.

## Exceptions
Exceptions require documented business constraint, measurement evidence, impact, alternative considered, rollback, and explicit approval when production risk or material spend increases.

## Verification
Review load tests, latency profiles, cost dashboards, query traces, token/candidate distributions, backpressure tests, cache-isolation tests, and before/after benchmarks.