# Performance and Cost Rules

## Purpose
Meet memory latency and cost objectives using measured evidence without compromising correctness or safety.

## Scope
Retrieval latency, write latency, embedding cost, storage growth, index size, batching, and query efficiency.

## MUST
- Performance targets MUST define representative workloads and percentile objectives.
- Optimization claims MUST be supported by before-and-after measurements.
- Retrieval benchmarks MUST include realistic memory volume, metadata filters, and tenant distribution.
- Cost changes MUST be evaluated for effects on recall, freshness, deletion latency, and reliability.
- Material performance regressions against agreed objectives MUST block promotion unless explicitly accepted.

## MUST NOT
- MUST NOT reduce authorization checks to improve latency.
- MUST NOT delete required provenance or retention data solely to reduce cost.
- MUST NOT optimize synthetic benchmarks while degrading end-to-end task performance.

## SHOULD
- Track p50, p95, p99 latency, storage growth, embedding spend, and cost per useful retrieval where meaningful.
- Prefer selective retrieval over unbounded context growth.

## Exceptions
Accepted regressions require benefit, evidence, risk, mitigation, and approval.

## Verification
Review benchmarks, profiles, cost reports, retrieval evaluations, and SLO dashboards.