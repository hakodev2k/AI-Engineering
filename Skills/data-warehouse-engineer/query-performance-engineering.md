# Query Performance Engineering

## Purpose
Diagnose and improve analytical query performance using workload evidence rather than guesswork.

## When to use
Use for slow dashboards, expensive transformations, concurrency degradation, or rising warehouse spend.

## Inputs
Query text, execution plans, runtime history, bytes scanned, table statistics, concurrency, warehouse configuration.

## Context to inspect
Recent schema changes, partitions, clustering, materializations, joins, filters, UDFs, spills, queue time, and cache behavior.

## Core knowledge
Performance bottlenecks may be scan, shuffle, join, skew, spill, queue, or computation bound. Optimization must consider cost, maintainability, freshness, and concurrency.

## Procedure
1. Reproduce or identify the exact workload.
2. Capture baseline latency and cost.
3. Inspect the execution plan and stage-level statistics.
4. Identify dominant scan, shuffle, join, spill, or queue costs.
5. Reduce data early through pruning and projection.
6. Fix skewed or explosive joins.
7. Evaluate materialization or pre-aggregation.
8. Review physical design and warehouse sizing.
9. Re-run the same workload.
10. Record the measured delta and regression guard.

## Decision points
Rewrite SQL before adding compute when query shape is the root cause. Materialize repeated expensive logic when freshness permits. Scale compute when concurrency or resource saturation remains after query fixes.

## Common failure patterns
Blindly adding indexes or compute, optimizing cached runs, ignoring row multiplication, and benchmarking with nonrepresentative filters.

## Verification
Compare uncached representative runs, execution plans, bytes processed, runtime percentiles, and cost.

## Expected output
A measured diagnosis, implemented optimization, and evidence of improvement.

## Stop conditions
Stop when production workload cannot be safely reproduced or plan telemetry is insufficient to distinguish causes.