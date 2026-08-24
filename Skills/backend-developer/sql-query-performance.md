# SQL Query Performance

## Purpose
Diagnose and improve database query latency and resource consumption using evidence rather than guesswork.

## When to use
Use for slow endpoints, high database load, timeouts, regressions, or capacity constraints.

## Inputs
Slow queries, execution plans, schema, indexes, timings, row counts, database metrics.

## Context to inspect
Generated SQL, parameters, statistics, indexes, locks, waits, data distribution, query frequency, and application call pattern.

## Core knowledge
Execution plans, cardinality estimation, sargability, join strategies, covering/selective indexes, parameter sensitivity, locking, and pagination.

## Procedure
1. Capture baseline latency and frequency.
2. Reproduce with representative parameters and data.
3. Inspect the actual execution plan and waits.
4. Identify scans, bad estimates, spills, excessive joins, sorting, or lock contention.
5. Reduce rows/columns early and remove N+1 behavior.
6. Test query rewrites before adding indexes.
7. Add or change indexes only with write/storage cost considered.
8. Benchmark before and after under representative load.

## Decision points
Choose query rewrite, index, precomputation, caching, or schema change according to measured bottleneck and workload trade-offs.

## Common failure patterns
Blind indexing, testing tiny datasets, ignoring parameter variance, selecting unnecessary columns, offset pagination at huge depth, and optimizing low-frequency queries.

## Verification
Compare execution plans, p50/p95/p99 latency, logical/physical reads, CPU, lock waits, and regression tests.

## Expected output
Measured improvement with documented cause, change, trade-offs, and evidence.

## Stop conditions
Stop when production-only evidence requires privileged access or a risky index/schema operation needs DBA approval.