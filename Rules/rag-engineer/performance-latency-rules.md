# Performance and Latency Rules

## Purpose
Keep retrieval latency, throughput, and cost within explicit production targets.

## Scope
Query encoding, search, filtering, reranking, context assembly, caches, network calls, and concurrency.

## MUST
- Performance targets MUST define representative workloads and percentile objectives.
- Optimization claims MUST be supported by before/after measurements.
- End-to-end latency MUST be decomposed by retrieval stage.
- Load tests MUST reflect realistic query mix, index size, filters, and concurrency.
- Timeouts and concurrency limits MUST prevent cascading resource exhaustion.

## MUST NOT
- MUST NOT hide latency by silently dropping required retrieval stages.
- MUST NOT add caches without invalidation, authorization, and freshness behavior.
- MUST NOT optimize only p50 when tail latency affects user-facing objectives.

## SHOULD
- Track p50, p95, p99, throughput, saturation, cache hit rate, and cost per request.
- Bound candidate counts before expensive reranking.

## Exceptions
Accepted regressions require measured benefit, impact analysis, mitigation, and approval.

## Verification
Review benchmarks, load tests, traces, saturation metrics, cache tests, and SLO reports.