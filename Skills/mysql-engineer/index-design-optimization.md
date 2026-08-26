# Index Design and Optimization

## Purpose
Design MySQL indexes that reduce query cost without imposing unnecessary write, memory, and storage overhead.

## When to use
Use for slow queries, new access paths, index reviews, or write-amplification investigations.

## Inputs
SQL, EXPLAIN/EXPLAIN ANALYZE output, table DDL, cardinality, workload frequency, latency targets.

## Context to inspect
Existing indexes, statistics, predicate selectivity, joins, ORDER BY/GROUP BY, covering opportunities, write rate.

## Core knowledge
InnoDB secondary indexes contain the primary key. Composite indexes follow leftmost-prefix behavior; column order should reflect equality predicates, range predicates, ordering, selectivity, and covering value. Every index has write and cache cost.

## Procedure
1. Rank expensive queries by business impact and frequency.
2. Capture current plans and actual timing.
3. Identify filtering, join, ordering, grouping, and projection columns.
4. Check whether an existing index can serve the access path.
5. Design the smallest useful composite index.
6. Avoid duplicate/prefix-redundant indexes.
7. Test with production-like cardinality and parameter distributions.
8. Compare reads, rows examined, latency, writes, and index size.
9. Observe after deployment before removing superseded indexes.

## Decision points
Choose covering indexes for critical read paths when extra width is justified. Prefer fewer selective composite indexes over many single-column indexes when workload supports it.

## Common failure patterns
Indexing every column, wrong composite order, ignoring primary-key width, trusting estimated plans blindly, low-selectivity indexes, and dropping indexes before observing real traffic.

## Verification
Use EXPLAIN ANALYZE where safe, slow-query evidence, handler/read metrics, latency percentiles, and write impact. Confirm plan stability across representative parameter values.

## Expected output
An index change with before/after evidence and rollback plan.

## Stop conditions
Stop when workload evidence is missing, the change risks long blocking DDL, or plan regressions appear on other critical queries.