# PostgreSQL Index Design

## Purpose
Design indexes that improve critical workloads without imposing unjustified write, storage, and maintenance cost.

## When to use
Use for slow queries, new high-value access paths, uniqueness enforcement, or workload reviews.

## Inputs
Queries, EXPLAIN plans, table statistics, write rate, selectivity, latency goals, storage constraints.

## Context to inspect
Existing indexes, predicates, join keys, sort requirements, column distributions, HOT-update behavior, and duplicate indexes.

## Core knowledge
Understand B-tree, GIN, GiST, BRIN, hash indexes, multicolumn ordering, INCLUDE, partial and expression indexes. Index usefulness depends on predicates, selectivity, ordering, statistics, and planner cost.

## Procedure
1. Capture the target workload and baseline plan.
2. Identify expensive scans, joins, filters, or sorts.
3. Choose an index method matching operators.
4. Order multicolumn keys by actual predicate/order needs.
5. Consider partial, expression, or covering indexes.
6. Estimate write/storage impact.
7. Create safely, using concurrent techniques where production requires them.
8. ANALYZE if necessary and compare plans.
9. Check for redundant indexes.
10. Monitor after deployment.

## Decision points
Prefer BRIN for naturally correlated very large tables, GIN for suitable arrays/JSONB/full text, and B-tree for common equality/range/order workloads.

## Common failure patterns
Indexing every column, wrong key order, duplicate indexes, assuming index-only scans without visibility-map support, ignoring write amplification.

## Verification
Measure plan shape, buffers, execution time, write overhead, index size, and production latency.

## Expected output
Index DDL, rationale, measured benefit, operational deployment plan.

## Stop conditions
Escalate if production creation risks unacceptable locking, disk exhaustion, or replication impact.