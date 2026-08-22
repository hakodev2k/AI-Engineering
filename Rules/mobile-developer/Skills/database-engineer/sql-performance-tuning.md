# SQL Performance Tuning

## Purpose
Improve SQL workload performance through evidence-driven changes to queries, access paths, data shape, and resource usage.

## When to use
Use for latency regressions, expensive reports, batch overruns, high database CPU or IO, and scaling problems.

## Inputs
Workload metrics, SQL, plans, waits, indexes, statistics, data distribution, concurrency, and performance objectives.

## Context to inspect
Inspect the whole request path, not only SQL text. Determine whether database time is CPU, IO, locking, network, memory, or queueing dominated.

## Core knowledge
Performance tuning is iterative: establish a baseline, identify the dominant bottleneck, change one meaningful variable, and measure again. Faster isolated SQL can still worsen system throughput.

## Procedure
1. Define target latency, throughput, and resource constraints.
2. Capture baseline metrics under representative load.
3. Rank queries by total workload impact, not anecdotal slowness.
4. Analyze plans and waits for top contributors.
5. Reduce unnecessary rows, columns, joins, sorts, and round trips.
6. Improve predicates and access paths.
7. Evaluate indexes and statistics.
8. Check batching, pagination, and set-based alternatives.
9. Benchmark under realistic concurrency.
10. Monitor after deployment for shifted bottlenecks.

## Decision points
Prefer query or access-path fixes before scaling hardware when they remove waste. Scale resources when workload is legitimate and efficiently executed.

## Common failure patterns
Premature hints, micro-optimizing rare queries, adding indexes without workload analysis, tuning development-sized data, and ignoring lock contention.

## Verification
Compare p50/p95/p99 latency, throughput, CPU, IO, reads, waits, and concurrency behavior against baseline.

## Expected output
A measured tuning change with root cause, benchmark evidence, production monitoring criteria, and rollback plan.

## Stop conditions
Stop when no representative baseline exists, the bottleneck is outside the database, or changes require business-semantic decisions not yet resolved.