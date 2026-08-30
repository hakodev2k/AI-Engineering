# Warehouse Partitioning and Clustering

## Purpose
Choose physical data organization that reduces scan cost and latency without creating excessive maintenance overhead.

## When to use
Use when large warehouse tables exhibit expensive scans, skewed access patterns, slow pruning, or poor concurrency.

## Inputs
Table sizes, query history, filter predicates, join patterns, ingestion cadence, cardinality, retention policy, platform capabilities.

## Context to inspect
Current partitions, clustering/sort keys, bytes scanned, pruning statistics, data skew, maintenance jobs, and recent workload changes.

## Core knowledge
Partitioning should align with high-selectivity bounded predicates, often time. Clustering/sorting improves locality within partitions. Too many tiny partitions, high-cardinality partition keys, or constantly changing cluster keys can degrade performance.

## Procedure
1. Rank tables by scan cost and latency impact.
2. Analyze dominant filters and date ranges.
3. Estimate partition sizes and counts.
4. Select partition keys that enable reliable pruning.
5. Select clustering/sort keys from frequent selective predicates and joins.
6. Account for skew and ingestion order.
7. Prototype on representative data.
8. Compare bytes scanned, runtime, and maintenance cost.
9. Plan migration without breaking consumers.
10. Reassess as workload patterns change.

## Decision points
Partition when pruning materially reduces data touched. Cluster when repeated filters or joins benefit from locality. Avoid physical complexity for small tables.

## Common failure patterns
Partitioning by unique identifiers, thousands of tiny partitions, using ingestion time when business time is queried, and optimizing one dashboard at the expense of the broader workload.

## Verification
Compare representative query plans, bytes scanned, latency percentiles, and storage/maintenance cost before and after.

## Expected output
A justified physical design with measured workload improvements and operational trade-offs.

## Stop conditions
Stop when workload telemetry is absent or the proposed migration risks data loss without a reversible plan.