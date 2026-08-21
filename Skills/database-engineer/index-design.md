# Index Design

## Purpose
Design indexes that reduce real workload cost while controlling write amplification, storage, and maintenance overhead.

## When to use
Use when queries scan excessive data, latency grows with volume, new access patterns are introduced, or index portfolios need review.

## Inputs
Slow queries, execution plans, predicates, joins, ordering, cardinality, workload frequency, write rate, and existing indexes.

## Context to inspect
Inspect table size, key distribution, index definitions, usage statistics, query plans, parameter behavior, and maintenance cost.

## Core knowledge
Indexes trade additional storage and write work for faster access. Key order, selectivity, covering columns, filtered or partial indexes, and clustered organization must follow workload evidence rather than generic rules.

## Procedure
1. Capture representative expensive queries and plans.
2. Identify scan, lookup, join, sort, and cardinality problems.
3. Map equality, range, join, and ordering predicates.
4. Check whether an existing index can be adjusted or reused.
5. Choose key order based on access pattern and engine behavior.
6. Add included columns only when lookup reduction justifies width.
7. Consider filtered or partial indexes for stable selective subsets.
8. Estimate write, storage, and maintenance impact.
9. Test against production-like data and parameter distributions.
10. Remove redundant indexes only after usage evidence and rollback planning.

## Decision points
Prefer narrow reusable indexes over many query-specific wide indexes. Use specialized indexes when a critical workload has distinct access characteristics and measurable benefit.

## Common failure patterns
Indexing every column, trusting missing-index suggestions blindly, duplicate indexes, excessively wide keys, ignoring write-heavy workloads, and testing on tiny datasets.

## Verification
Compare logical reads, elapsed time, CPU, plan shape, write overhead, and storage before and after the change.

## Expected output
An index change with measured benefit, cost analysis, deployment plan, and rollback criteria.

## Stop conditions
Stop when representative workload evidence is unavailable, an index change risks unacceptable write impact, or engine-specific behavior is uncertain and cannot be tested.