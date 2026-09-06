# Performance and Latency Rules

## Purpose
Meet feature retrieval and materialization performance targets using measured evidence.

## Scope
Online read latency, offline query performance, serialization, caching, joins, and materialization throughput.

## MUST
- Performance targets MUST define representative workloads and percentile objectives.
- Optimization claims MUST be supported by before/after measurements.
- Online serving benchmarks MUST include realistic key distribution, payload size, concurrency, and cache state.
- Slow offline jobs MUST be analyzed using query plans, profiles, or equivalent runtime evidence.
- Performance regressions that violate agreed SLOs MUST block release unless explicitly accepted.

## MUST NOT
- MUST NOT optimize synthetic microbenchmarks at the expense of end-to-end behavior.
- MUST NOT hide latency by serving semantically invalid stale data.
- MUST NOT add caches without an invalidation and consistency strategy.

## SHOULD
- Track p50, p95, p99, throughput, and saturation for online serving.
- Prefer bounded payloads and selective feature retrieval.

## Exceptions
Accepted regressions require benefit, user impact, evidence, mitigation, and approval.

## Verification
Review benchmarks, query plans, profiles, dashboards, and SLO reports.