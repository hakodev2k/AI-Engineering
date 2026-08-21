# Database Query Performance

## Purpose
Diagnose and improve database latency and throughput using query evidence, execution plans, indexing, cardinality, and workload-aware changes.

## When to use
Use for slow queries, high database CPU/I/O, timeouts, blocking, excessive round trips, or database-constrained request paths.

## Inputs
Queries, execution plans, schema, indexes, table statistics, runtime metrics, wait information, application call patterns, and representative parameters.

## Context to inspect
Inspect row counts, selectivity, parameter distributions, joins, sorts, scans/seeks, key lookups, spills, locks, transaction scope, ORM-generated SQL, and network round trips.

## Core knowledge
A fast query for one parameter may be slow for another. Indexes trade read performance against write/storage cost. Execution plans must be interpreted with actual cardinality and workload context.

## Procedure
1. Identify the database operations dominating user latency or resource use.
2. Capture representative SQL and parameters.
3. Inspect actual execution plans and runtime statistics.
4. Compare estimated versus actual row counts.
5. Identify expensive scans, joins, sorts, lookups, spills, or waits.
6. Check existing indexes and their workload cost.
7. Reduce unnecessary rows, columns, and round trips.
8. Adjust query shape, indexes, statistics, or data model based on evidence.
9. Re-run with representative parameter distributions and concurrency.
10. Measure application-level impact and write overhead.

## Decision points
Prefer query changes when they reduce work broadly; add indexes when access patterns justify maintenance cost; denormalize only when simpler options cannot meet requirements.

## Common failure patterns
Indexing every predicate, trusting estimated plans only, testing one parameter, ignoring ORM N+1 behavior, missing transaction blocking, and optimizing database time that is not on the critical path.

## Verification
Confirm plan behavior, logical/physical work, latency distribution, concurrency behavior, and application SLO impact improve without unacceptable write/storage cost.

## Expected output
A query-level root cause with plan evidence and verified remediation.

## Stop conditions
Escalate when schema/index changes require migration approval or production evidence cannot be collected safely.