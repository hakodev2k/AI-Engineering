# Graph Query Performance

## Purpose
Investigate and improve slow graph queries using evidence from execution plans, cardinalities, indexes, cache behavior, and graph topology.

## When to use
Use when SPARQL/Cypher latency, CPU, memory, lock contention, or traversal cost exceeds SLOs.

## Inputs
Slow queries, parameters, execution plans, graph statistics, indexes, telemetry, workload shape.

## Preconditions
Capture a reproducible baseline before changing schema or infrastructure.

## Context to inspect
Query plans, selectivity, high-degree nodes, path expansions, cache hit rates, concurrency, index coverage, data skew.

## Core knowledge
Graph workloads often fail because intermediate result sets explode. The most effective optimization usually reduces expansion early rather than adding hardware blindly.

## Procedure
1. Reproduce representative slow queries.
2. Measure latency and resource baseline.
3. Inspect plan operators and row/cardinality estimates.
4. Identify broad scans and explosive expansions.
5. Verify index selectivity.
6. Rewrite pattern order or predicates to reduce intermediate results.
7. Bound paths and result sizes.
8. Consider model changes only after query-level evidence.
9. Benchmark under realistic concurrency.
10. Record before/after evidence and regression thresholds.

## Decision points
Add indexes for stable selective predicates; denormalize or materialize relationships only for proven hot paths with acceptable freshness cost.

## Common failure patterns
Optimizing from intuition, testing tiny graphs, adding duplicate indexes, hiding cost with larger timeouts, and ignoring supernodes.

## Verification
Compare plan cost, p50/p95/p99 latency, resource utilization, and correctness before and after changes.

## Expected output
Root-cause analysis, optimized query/model changes, benchmark evidence, and monitoring thresholds.

## Stop conditions
Escalate when optimization requires disruptive graph repartitioning, infrastructure expansion, or semantic model changes.