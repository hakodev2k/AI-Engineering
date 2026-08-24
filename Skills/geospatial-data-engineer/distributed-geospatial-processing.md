# Distributed Geospatial Processing

## Purpose
Scale spatial processing across partitions and workers while controlling shuffles, skew, duplication, and spatial boundary effects.

## When to use
Use when datasets or processing windows exceed single-node capacity or when batch deadlines require parallel execution.

## Inputs
Dataset sizes, spatial distribution, workload DAG, cluster resources, partitioning options, latency or batch SLA.

## Context to inspect
Inspect data skew, feature extent, join predicates, current partition keys, shuffle volume, memory pressure, retry behavior, and output idempotency.

## Core knowledge
Spatial partitioning is not equivalent to ordinary hash partitioning. Features spanning partition boundaries may need replication, and dense urban regions can create severe skew.

## Procedure
1. Baseline the workload on a representative subset.
2. Identify CPU, memory, I/O, and shuffle bottlenecks.
3. Choose spatial or hybrid partitioning aligned to query locality.
4. Define boundary replication or halo rules where needed.
5. Control large or global geometries separately.
6. Push down attribute and spatial filters early.
7. Make outputs idempotent and retry-safe.
8. Measure skew and rebalance hotspots.
9. Validate that partitioning does not change result semantics.
10. Document operational resource expectations.

## Decision points
Prefer scale-up for moderately sized workloads when complexity outweighs cluster benefits. Scale out when independent partitions or repeatable large workloads justify orchestration overhead.

## Common failure patterns
Hash partitioning spatial joins, unbounded shuffles, duplicate boundary results, one pathological geometry dominating a task, and assuming more workers always improve throughput.

## Verification
Compare distributed results with a trusted smaller reference, inspect shuffle and skew metrics, and measure runtime, cost, and retry behavior.

## Expected output
A partitioned processing design with correctness evidence and measured resource behavior.

## Stop conditions
Stop when distributed semantics cannot be validated, cluster limits make the SLA infeasible, or partition duplication produces unresolved correctness risk.