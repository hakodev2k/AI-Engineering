# Latency and Performance Rules

## Purpose
Protect search responsiveness while preserving ranking quality and system stability.

## Scope
Applies to retrieval latency, reranking cost, feature computation, index access, network calls, caching, and tail performance.

## MUST
- Performance targets MUST define relevant percentiles and representative workload conditions.
- Ranking-stage additions MUST be measured for incremental latency and resource cost before release.
- Timeouts and candidate limits MUST have explicit behavior when budgets are exceeded.
- Performance claims MUST use before/after measurements under comparable conditions.

## MUST NOT
- MUST NOT improve average latency by introducing severe tail regressions without explicit acceptance.
- MUST NOT reduce candidate depth or ranking stages without measuring relevance impact.
- MUST NOT rely on unbounded synchronous dependencies in the critical query path.

## SHOULD
- Track stage-level latency, cache hit rate, saturation, and query-class performance.

## Exceptions
Accepted regressions require documented user impact, benefit, evidence, mitigation, and approval.

## Verification
Inspect benchmarks, traces, p95/p99 dashboards, resource telemetry, timeout tests, and relevance comparisons.