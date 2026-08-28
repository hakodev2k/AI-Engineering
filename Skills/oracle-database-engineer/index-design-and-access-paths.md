# Index Design and Access Paths

## Purpose
Design and maintain Oracle indexes that improve important access paths without creating excessive DML, storage, or maintenance cost.

## When to use
Use for query tuning, schema design, uniqueness enforcement, and index portfolio reviews.

## Inputs
Query predicates/orderings, execution plans, DML rates, column cardinality, table size, partitioning, storage constraints.

## Context to inspect
Existing B-tree/bitmap/function-based indexes, clustering factor, selectivity, compression, visibility, partition alignment, and unused/duplicate structures.

## Core knowledge
Index usefulness depends on selectivity, clustering, predicate shape, ordering, table access cost, and workload mix. More indexes can degrade write-heavy systems.

## Procedure
1. Identify high-value queries and exact predicate/order requirements.
2. Inspect current plans and index usage.
3. Evaluate selectivity, clustering factor, and expected returned-row fraction.
4. Order composite columns based on access patterns, not simplistic selectivity rules.
5. Consider covering needs while limiting index width.
6. Use function-based indexes only with stable deterministic expressions and matching predicates.
7. Evaluate local/global indexes for partitioned tables.
8. Estimate DML and storage overhead.
9. Test with invisible indexes where operationally appropriate.
10. Remove redundant indexes only after workload evidence and rollback planning.

## Decision points
Prefer B-tree for common OLTP access; use bitmap only for suitable low-concurrency analytical workloads. Choose local partitioned indexes for manageability unless cross-partition access requires global behavior.

## Common failure patterns
Indexing every column, wrong composite order, bitmap indexes on hot OLTP tables, duplicated prefixes, and ignoring clustering factor.

## Verification
Compare actual plans, logical reads, elapsed time, DML overhead, and storage before/after.

## Expected output
A justified index design with measured benefits and lifecycle plan.

## Stop conditions
Stop when workload samples are incomplete or the index would jeopardize critical write SLAs.