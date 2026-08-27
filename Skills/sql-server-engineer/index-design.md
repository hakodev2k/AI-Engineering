# Index Design

## Purpose
Design SQL Server indexes that improve critical access paths without creating excessive write, storage, and maintenance cost.

## When to use
Use for recurring query bottlenecks, workload design, or index consolidation.

## Inputs
Workload queries, actual plans, table cardinalities, existing indexes, write rates, data distribution, Query Store evidence.

## Context to inspect
Inspect predicates, joins, ordering/grouping, key lookups, existing key/include columns, uniqueness, filtered opportunities, compression, and index usage.

## Core knowledge
Indexes optimize access patterns, not tables in isolation. Key order controls seekability; INCLUDE columns cover projections without enlarging the search key. Every index increases write amplification and operational cost.

## Procedure
1. Rank workload by business impact and resource use.
2. Map predicates and joins to candidate leading keys.
3. Choose key order using equality, range, ordering, and selectivity behavior.
4. Add only necessary INCLUDE columns.
5. Consider filtered indexes for stable selective subsets.
6. Compare against existing indexes and consolidate overlap.
7. Estimate storage and write impact.
8. Create in a safe environment.
9. measure plans and runtime.
10. Observe production usage over a representative period.

## Decision points
Choose clustered keys for durable row identity and access locality, not merely because a column is frequently filtered. Prefer a narrower reusable index over many near-duplicates unless workload evidence justifies specialization.

## Common failure patterns
Blindly applying missing-index DMVs, over-wide INCLUDE lists, wrong key order, redundant indexes, low-selectivity leading keys, and ignoring update/delete cost.

## Verification
Confirm improved reads/CPU/latency and acceptable DML overhead, storage, locking, and maintenance duration.

## Expected output
An index definition, workload rationale, measured benefit, operational cost assessment, and rollback plan.

## Stop conditions
Stop when workload evidence is insufficient, disk capacity is uncertain, or index creation would breach production change controls.