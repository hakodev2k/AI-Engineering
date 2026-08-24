# Spatial Indexing and Query Planning

## Purpose
Design spatial indexes and query patterns that keep geospatial workloads predictable at production scale.

## When to use
Use when spatial predicates, nearest-neighbor searches, bounding-box filters, or spatial joins become slow or highly variable.

## Inputs
Schema, query workload, execution plans, row counts, geometry distributions, database capabilities, latency targets.

## Context to inspect
Inspect existing indexes, statistics, geometry types, SRIDs, filter selectivity, query plans, partitioning, and data skew.

## Core knowledge
Spatial indexes accelerate candidate filtering but do not eliminate exact geometry tests. Index effectiveness depends on selectivity, geometry extent, statistics, operator support, and query structure.

## Procedure
1. Capture representative slow queries and baseline timings.
2. Inspect execution plans and confirm whether a spatial index is used.
3. Measure geometry distribution and bounding-box selectivity.
4. Choose an index type supported by the database and predicate family.
5. Rewrite predicates to preserve indexability before considering denormalization.
6. Add supporting scalar indexes for non-spatial filters when selective.
7. Rebuild statistics and retest realistic workloads.
8. Compare exact versus approximate filtering cost.
9. Test worst-case dense regions, large geometries, and skewed partitions.
10. Document query patterns that must remain index-friendly.

## Decision points
Prefer one well-matched spatial index over redundant indexes. Partition when pruning materially reduces candidate sets. Precompute derived geometries only when repeated computation dominates and freshness requirements permit it.

## Common failure patterns
Functions wrapped around indexed geometry columns, mismatched SRIDs, full-table spatial joins, stale statistics, indexing tiny tables unnecessarily, and assuming index usage guarantees low latency.

## Verification
Verify execution plans, p50/p95 latency, scanned rows, index size, write overhead, and result correctness before and after changes.

## Expected output
An index and query design with measured performance improvement and documented trade-offs.

## Stop conditions
Stop when the workload cannot be reproduced, data distribution is unknown, or proposed indexing would violate write/storage constraints without approval.