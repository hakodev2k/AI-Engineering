# Serving and Latency Rules

## Purpose
Keep recommendation serving fast, bounded, and predictable under production load.

## Scope
Applies to online feature fetches, retrieval, model inference, reranking, remote calls, and end-to-end latency budgets.

## MUST
- Recommendation serving MUST define end-to-end latency targets and component-level time budgets.
- Remote dependencies MUST use explicit timeouts and bounded retries that fit within the request budget.
- Expensive inference or retrieval changes MUST be benchmarked under representative concurrency before rollout.
- Degraded behavior MUST be defined for unavailable features, models, indexes, or dependencies.
- Tail latency MUST be monitored separately from averages.

## MUST NOT
- MUST NOT add synchronous fan-out without measuring worst-case latency and failure amplification.
- MUST NOT use unbounded retries in the serving path.
- MUST NOT claim performance improvement without before-and-after measurement.

## SHOULD
- Serving paths SHOULD avoid work that can be precomputed without reducing freshness beyond requirements.
- Latency budgets SHOULD reserve headroom for traffic growth and dependency variance.

## Exceptions
Exceptions require measured evidence, bounded risk, rollback readiness, and review for user-facing latency impact.

## Verification
Review benchmarks, tracing data, timeout configuration, load tests, p95/p99 dashboards, and degraded-mode tests.