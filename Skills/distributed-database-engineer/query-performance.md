# Distributed Query Performance

## Purpose
Diagnose and improve query latency by separating local execution cost from distributed coordination and data movement.

## When to use
Use for slow queries, tail-latency regressions, excessive fan-out, or capacity incidents.

## Inputs
Query text/API, execution plans, traces, per-node metrics, data distribution, latency percentiles.

## Context to inspect
Routing, shard pruning, indexes, statistics, coordinator behavior, network time, cache state, concurrency, and resource saturation.

## Core knowledge
Distributed query latency is often dominated by the slowest participating shard, fan-out width, network round trips, repartitioning, and coordinator work. Optimizing a local operator may not improve end-to-end tails.

## Procedure
1. Reproduce with representative parameters.
2. Capture end-to-end traces and plans.
3. Separate queue, network, coordinator, and shard execution time.
4. Check shard pruning and data skew.
5. Inspect index and statistics quality.
6. Identify cross-shard joins, sorts, or aggregations.
7. Reduce data movement before micro-optimizing operators.
8. Benchmark candidate changes at realistic concurrency.
9. Compare p50, p95, p99, resource use, and result correctness.

## Decision points
Prefer schema/routing changes for structural fan-out problems; use index or query changes for local bottlenecks; add capacity only after proving saturation is causal.

## Common failure patterns
Testing only averages, warm-cache benchmarks, ignoring skew, optimizing one shard, and scaling hardware before fixing unnecessary data movement.

## Verification
Use before/after traces and load tests, confirm identical results, and ensure improvements persist at peak concurrency.

## Expected output
A measured bottleneck explanation, targeted remediation, benchmark evidence, and regression guard.

## Stop conditions
Escalate when production-like reproduction is impossible or proposed changes alter data semantics or require risky repartitioning.