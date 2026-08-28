# Partitioning and Large Table Management

## Purpose
Use Oracle partitioning to improve manageability, pruning, lifecycle operations, and selected query patterns for large datasets.

## When to use
Use for very large tables/indexes, time-based retention, bulk loads, archival, and queries with natural partition predicates.

## Inputs
Table size/growth, query predicates, retention policy, load/delete patterns, maintenance windows, licensing constraints.

## Context to inspect
Range/list/hash/composite partitions, interval behavior, local/global indexes, statistics, pruning plans, partition-wise joins, and lifecycle operations.

## Core knowledge
Partitioning is not an automatic performance feature. Benefits come from pruning, partition-wise operations, and operational isolation; poor partition keys can increase complexity without reducing scanned work.

## Procedure
1. Quantify table growth, query scans, and retention operations.
2. Identify stable partition keys aligned with lifecycle and predicates.
3. Select partition type and granularity from workload evidence.
4. Estimate partition count and metadata/maintenance impact.
5. Choose local/global index strategy.
6. Validate partition pruning on representative SQL.
7. Design load/exchange/drop workflows for minimal disruption.
8. Configure incremental statistics where useful.
9. Test rolling retention and recovery procedures.
10. Document future repartitioning thresholds.

## Decision points
Prefer time-range partitioning for time-based lifecycle; hash when even distribution matters; composite when both pruning and distribution provide value.

## Common failure patterns
Daily partitions without lifecycle need, partition key absent from queries, global-index invalidation surprises, and assuming partitioning replaces indexing.

## Verification
Inspect PSTART/PSTOP and actual plans, measure maintenance duration, and validate retention/load operations.

## Expected output
A partition design with pruning and lifecycle evidence.

## Stop conditions
Stop when licensing, partition key semantics, or maintenance requirements are unresolved.