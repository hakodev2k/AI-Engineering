# Quality Control Performance

## Purpose
Keep data validation effective without creating excessive query cost, pipeline latency, memory pressure, or contention.

## When to use
Use when quality checks become slow, expensive, or operationally disruptive as data volume grows.

## Inputs
Rule queries, execution plans, dataset sizes, partitions, runtimes, resource metrics, SLOs, and cost data.

## Preconditions
Preserve correctness requirements before optimizing execution.

## Context to inspect
Inspect scan volume, partition pruning, joins, cardinality, indexes, clustering, incremental boundaries, concurrency, engine statistics, and duplicated checks.

## Core knowledge
Validation cost depends on data scanned, shuffle/join behavior, state, frequency, and concurrency. Incremental checks improve efficiency only when change boundaries are trustworthy.

## Procedure
1. Measure rule runtime, resources, and scan volume.
2. Rank expensive checks by value and cost.
3. Inspect query/execution plans.
4. Eliminate redundant scans and repeated computations.
5. Apply partition pruning and predicate pushdown.
6. Use incremental validation when safe.
7. Precompute reusable control aggregates where justified.
8. Separate fast gates from deeper asynchronous audits.
9. Load-test validation at expected scale.
10. Confirm optimizations preserve defect detection.
11. Monitor cost regressions over time.

## Decision points
Full scans are justified for critical invariants when affordable. Sampling is appropriate for exploratory/statistical monitoring, not hard integrity guarantees. Materialize controls when repeated computation costs exceed maintenance complexity.

## Common failure patterns
Sampling uniqueness checks incorrectly; optimizing away important coverage; unbounded cross joins; validating unchanged history every run; quality jobs competing with production at peak load.

## Verification
Compare old/new rule outputs on seeded defects, benchmark runtime and resources, and confirm production SLO/cost improvement without coverage loss.

## Expected output
Optimized controls with measured cost, latency, preserved semantics, and scale evidence.

## Stop conditions
Stop when optimization would weaken a critical guarantee without approval or testing risks unacceptable production load.