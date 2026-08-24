# Search Performance

## Purpose
Protect latency, throughput, and resource efficiency using measurement rather than intuition.

## Scope
Query execution, retrieval, reranking, serialization, caches, and cluster resource use.

## MUST
- Define latency objectives using percentiles appropriate to user experience, not averages alone.
- Benchmark material performance changes with representative queries, corpus size, concurrency, and hardware class.
- Profile slow queries before broad optimization.
- Bound query complexity, candidate counts, result sizes, and expensive features.

## MUST NOT
- Claim a performance improvement without before/after evidence.
- Trade severe relevance or correctness regressions for latency without explicit product acceptance.
- Benchmark only warm-cache happy paths when cold or mixed states occur in production.

## SHOULD
- Track p50, p95, p99, timeout rate, saturation, and cost per query where meaningful.
- Maintain a slow-query investigation workflow.

## Exceptions
Exceptions require measured trade-offs, affected SLOs, and approval when user-facing objectives are breached.

## Verification
Use load tests, profiles, query traces, percentile dashboards, resource metrics, and reproducible benchmarks.