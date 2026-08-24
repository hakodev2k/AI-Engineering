# Geospatial Performance Investigation

## Purpose
Diagnose and improve slow geospatial jobs, queries, and services using measured evidence rather than speculative optimization.

## When to use
Use for spatial-query latency, large ETL runtimes, tile bottlenecks, memory pressure, or scaling regressions.

## Inputs
Slow workload, metrics, execution plans, profiles, data volumes, geometry distributions, latency or throughput targets.

## Context to inspect
Inspect indexes, partitioning, CRS transformations, geometry complexity, I/O, serialization, memory use, data skew, and concurrency.

## Core knowledge
Spatial workloads are often dominated by candidate-set size, geometry complexity, reprojection, serialization, shuffle, or I/O. Optimizing the wrong layer can worsen total cost.

## Procedure
1. Reproduce the workload and establish a baseline.
2. Break total time into database, compute, network, serialization, and storage components.
3. Inspect execution plans or profiles.
4. Measure geometry complexity and spatial selectivity.
5. Identify the dominant bottleneck.
6. Apply one bounded change such as index, filter pushdown, simplification, partitioning, caching, or chunking.
7. Re-measure under the same workload.
8. Test dense and worst-case spatial regions.
9. Check correctness and resource trade-offs.
10. Keep changes only when evidence shows material benefit.

## Decision points
Simplify geometry only when precision budgets allow it. Cache stable expensive outputs when invalidation is tractable. Scale out only after eliminating avoidable local inefficiency.

## Common failure patterns
Premature simplification, adding indexes without plan evidence, benchmarking tiny samples, masking skew with averages, and improving latency by excessive memory use.

## Verification
Compare p50/p95/p99 latency or batch duration, CPU, memory, I/O, scanned candidates, output correctness, and cost.

## Expected output
A bottleneck diagnosis, measured intervention, before/after evidence, and residual constraints.

## Stop conditions
Stop when the workload cannot be reproduced, correctness tolerances are unknown, or optimization requires unsafe production experimentation.