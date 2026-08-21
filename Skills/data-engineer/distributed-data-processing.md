# Distributed Data Processing

## Purpose
Design and tune distributed transformations so large datasets are processed correctly without pathological shuffles, skew, memory pressure, or runaway cost.

## When to use
Use for Spark-like engines, distributed SQL, large joins, aggregations, repartitioning, and jobs that exceed a single-node execution model.

## Inputs
Job plan, dataset sizes, key distributions, partition counts, cluster resources, runtime metrics, and SLA.

## Context to inspect
Inspect stage DAGs, shuffle volume, skewed keys, spill, executor failures, serialization, partition pruning, and source/sink file layout.

## Core knowledge
Distributed performance is dominated by data movement, partition balance, parallelism, serialization, and memory. More workers do not fix poor algorithms or extreme skew.

## Procedure
1. Establish a runtime and cost baseline.
2. Inspect the physical execution plan.
3. Quantify input size and key distributions.
4. Eliminate unnecessary scans and shuffles.
5. Choose join strategies based on actual side sizes.
6. Address skew with filtering, salting, pre-aggregation, or model changes.
7. Tune partition count to task size and cluster capacity.
8. Cache only reused expensive intermediates.
9. Control output file count and size.
10. Rebenchmark under representative load.

## Decision points
Broadcast genuinely small dimensions when memory permits; shuffle when both sides are large. Scale resources only after confirming the workload remains efficiently parallelizable.

## Common failure patterns
Repartitioning blindly, caching everything, collecting large data to the driver, tiny output files, one hot key dominating a stage, and tuning configuration without plan evidence.

## Verification
Compare stage metrics before and after changes, verify result equivalence, inspect skew and spill, and measure runtime plus compute cost.

## Expected output
A correct distributed job with balanced work, controlled data movement, and measured resource efficiency.

## Stop conditions
Escalate when data distribution fundamentally prevents the SLA or platform-level resource limits require owner changes.