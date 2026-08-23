# Query Performance

## Purpose
Diagnose and improve database access using evidence rather than speculative tuning.

## When to use
Slow endpoints, high database load, timeout spikes, expensive reports, or scaling reviews.

## Inputs
Slow query samples, execution plans, schema, indexes, ORM-generated SQL, latency metrics, data distribution.

## Context to inspect
Actual SQL, parameter values, plan shape, row estimates, scans/seeks, joins, sorts, locks, network payloads.

## Core knowledge
Performance depends on selectivity, cardinality estimation, access paths, query shape, data distribution, concurrency, and returned volume. ORM syntax is not the execution plan.

## Procedure
1. Reproduce and baseline latency and resource use.
2. Capture actual SQL and representative parameters.
3. Inspect execution plan and row estimates.
4. Identify dominant operators and waits.
5. Remove unnecessary columns, joins, and round trips.
6. Fix non-sargable predicates where applicable.
7. Evaluate indexes against reads and write cost.
8. Address N+1 and over-fetching.
9. Benchmark the change under representative data.
10. Check regressions in other workloads.

## Decision points
Prefer query/schema fixes before caching when the database work is intrinsically wasteful. Add indexes only when expected workload benefit exceeds maintenance cost.

## Common failure patterns
Tuning without baseline, indexing every filter, testing tiny datasets, ignoring parameter sensitivity, client-side filtering, and optimizing ORM code without inspecting SQL.

## Verification
Compare before/after latency, logical reads, CPU, plan shape, and concurrency behavior.

## Expected output
Measured improvement with evidence and documented trade-offs.

## Stop conditions
Escalate if production evidence is required but unavailable or changes risk data integrity.