# Partitioning and File Layout

## Purpose
Design physical data layout that reduces unnecessary reads and metadata overhead while supporting expected write and query patterns.

## When to use
Use for large lake, lakehouse, warehouse, and distributed-processing datasets where physical layout materially affects performance or cost.

## Inputs
Dataset size, query predicates, ingestion pattern, cardinality, retention, file statistics, and engine capabilities.

## Context to inspect
Inspect current partition keys, pruning rates, file counts and sizes, skew, update patterns, clustering, and common query filters.

## Core knowledge
Good partitions eliminate large regions of data with common predicates and remain bounded in count. File size affects task overhead and parallelism. Clustering or sorting can improve pruning without directory explosion.

## Procedure
1. Measure common selective query predicates.
2. Quantify candidate key cardinality and distribution.
3. Avoid partitions that produce tiny files or hot keys.
4. Choose time partitions at a granularity matching data volume and retention.
5. Use clustering/sorting for secondary predicates where supported.
6. Define target file-size ranges.
7. Add compaction for streaming or micro-batch writes.
8. Ensure writes can update required partitions safely.
9. Benchmark pruning and task counts.
10. Monitor layout degradation over time.

## Decision points
Partition by date when time is a dominant filter and volume is sufficient; avoid user/device IDs unless domain scale and engine semantics justify them. Prefer clustering over extra partition dimensions when cardinality is high.

## Common failure patterns
Partitioning every column, hourly partitions for tiny data, one huge partition, thousands of tiny files, and partition keys never used by consumers.

## Verification
Inspect bytes/files scanned, partition pruning, file-size distribution, write amplification, and representative query latency.

## Expected output
A physical layout strategy with measured pruning, bounded metadata, and maintainable compaction behavior.

## Stop conditions
Escalate when changing layout requires a high-risk full rewrite without enough capacity or rollback path.