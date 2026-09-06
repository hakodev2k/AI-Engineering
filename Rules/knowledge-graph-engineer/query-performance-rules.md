# Query Performance Rules

## Purpose
Protect latency, throughput, and system stability for production graph workloads.

## Scope
Traversal depth, join patterns, path expansion, filters, aggregation, cardinality, and query planning.

## MUST
- Performance-sensitive queries MUST have measurable latency or throughput targets.
- Optimization claims MUST be supported by before-and-after measurements.
- High-cardinality traversals MUST be tested with representative production-like data.
- Slow queries MUST be investigated with execution plans, profiles, or equivalent runtime evidence.
- Query budgets MUST account for worst-case fan-out where applicable.

## MUST NOT
- MUST NOT rely on average latency alone for critical serving paths.
- MUST NOT remove correctness checks solely to reduce query time.
- MUST NOT assume an index improves performance without measurement.

## SHOULD
- Track percentile latency, scanned elements, result cardinality, and resource consumption.
- Prefer early selective filtering where semantics permit.

## Exceptions
Accepted regressions require evidence, impact assessment, mitigation, and approval.

## Verification
Inspect benchmarks, query plans, profiler output, production metrics, and load tests.