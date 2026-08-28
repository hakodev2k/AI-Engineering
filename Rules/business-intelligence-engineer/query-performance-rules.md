# Query Performance Rules

## Purpose
Keep BI workloads responsive without sacrificing correctness.

## Scope
Applies to warehouse queries, semantic models, extracts, dashboards, and scheduled transformations.

## MUST
- Performance changes MUST be supported by before-and-after measurements using representative workloads.
- Expensive production queries MUST be investigated using execution plans, runtime statistics, or equivalent evidence.
- Filters, partition pruning, aggregation strategy, and join cardinality MUST be considered before adding infrastructure solely for speed.
- Interactive dashboards MUST define acceptable response targets for critical views.

## MUST NOT
- MUST NOT claim an optimization succeeded without measurement.
- MUST NOT trade correctness for speed without explicit business approval and disclosed limitations.

## SHOULD
- Frequently repeated expensive computations SHOULD be pre-aggregated or cached when freshness requirements allow.

## Exceptions
Exceptions require measured evidence, trade-off analysis, known user impact, and approval.

## Verification
Review benchmarks, execution plans, workload metrics, dashboard timings, and regression results.