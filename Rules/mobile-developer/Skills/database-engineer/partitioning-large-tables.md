# Partitioning Large Tables

## Purpose
Use table or index partitioning to improve manageability, lifecycle operations, and selected access patterns for very large datasets.

## When to use
Use when data volume makes retention, loading, archival, maintenance, or partition-prunable queries operationally expensive.

## Inputs
Table size, growth rate, retention policy, query predicates, load patterns, index strategy, backup requirements, and engine capabilities.

## Context to inspect
Inspect whether queries consistently filter on a viable partition key, data distribution across candidate boundaries, unique-key constraints, and operational procedures.

## Core knowledge
Partitioning is primarily a data-management technique; it does not automatically make queries faster. Poor partition keys create hotspots, skew, or queries that touch every partition.

## Procedure
1. Define the operational problem partitioning should solve.
2. Measure current table growth and maintenance cost.
3. Identify stable partition-key candidates aligned with lifecycle and access patterns.
4. Choose range, list, hash, or engine-specific strategy based on need.
5. Define boundaries and future partition creation process.
6. Align indexes and uniqueness constraints with engine rules.
7. Test pruning on representative queries.
8. Design switch, detach, archive, or purge operations.
9. Automate monitoring for skew and missing future partitions.
10. Document rollback and repartitioning cost.

## Decision points
Do not partition merely because a table is large. Prefer simpler indexing when lifecycle and pruning benefits are weak.

## Common failure patterns
Choosing high-cardinality arbitrary keys, assuming partitioning replaces indexes, creating too many partitions, and failing to automate future boundaries.

## Verification
Verify partition elimination, balanced distribution, load/purge procedures, query regressions, and maintenance duration.

## Expected output
A partition design tied to measurable operational benefits and supported lifecycle procedures.

## Stop conditions
Stop when no stable partition key aligns with the problem or migration risk exceeds the expected benefit.