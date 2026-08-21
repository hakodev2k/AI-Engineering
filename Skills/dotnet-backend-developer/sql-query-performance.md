# SQL Query Performance

## Purpose
Diagnose and improve database query latency using evidence from SQL, plans, indexes, cardinality, and workload rather than guesswork.

## When to use
Slow endpoints/jobs, high DB CPU/IO, timeouts, regression after data growth, or ORM-generated SQL problems.

## Inputs
SQL, parameters, execution plan, schema, indexes, row counts, timings, workload metrics.

## Context to inspect
Generated SQL, actual execution plan where safe, statistics, index definitions, predicates, joins, ordering, selectivity, parameter patterns.

## Core knowledge
Sargability, cardinality estimation, seek vs scan, key lookups, covering indexes, sort/hash costs, join strategies, parameter sensitivity, statistics, write cost of indexes.

## Procedure
1. Reproduce with representative parameters/data.
2. Measure duration, reads, CPU, rows.
3. Inspect actual/estimated plan as available.
4. Find dominant operators and estimate/actual mismatches.
5. Reduce rows/columns early.
6. Rewrite non-sargable predicates when possible.
7. Evaluate indexes by workload, not one query only.
8. Retest under representative load.
9. Document before/after evidence and write-side trade-offs.

## Decision points
Rewrite SQL before adding indexes when query shape is fundamentally inefficient. Add indexes when stable selective access patterns justify read benefit and write/storage cost.

## Common failure patterns
Indexing every predicate, trusting one cold run, ignoring parameter sensitivity, functions on indexed columns, wildcard-leading searches, SELECT *, missing pagination.

## Verification
Compare execution plans and measured reads/CPU/latency before and after.

## Expected output
A measured optimization with known trade-offs.

## Stop conditions
Escalate production plan capture, large index builds, or risky schema changes requiring DBA approval.