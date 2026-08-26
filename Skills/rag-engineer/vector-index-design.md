# Vector Index Design

## Purpose
Design vector storage and approximate-nearest-neighbor search for required scale, latency, filtering, and recall.

## When to use
Use when creating or tuning dense retrieval infrastructure.

## Inputs
Vector count/dimension, update rate, filters, QPS, latency SLO, recall target, hardware, retention requirements.

## Context to inspect
Inspect vector database capabilities, ANN algorithm, sharding, replication, filter execution, index-build behavior, backups, and observed query distribution.

## Core knowledge
ANN parameters trade recall for memory, build time, and query latency. Metadata filtering can radically change effective search behavior. Index architecture must account for growth and rebuilds.

## Procedure
1. Estimate current and projected vector footprint.
2. Define recall and latency targets with exact-search samples where feasible.
3. Choose index family supported by workload characteristics.
4. Design partitioning and metadata filters.
5. Tune construction and query parameters empirically.
6. Test filtered and unfiltered workloads separately.
7. Measure memory, disk, build time, and concurrency.
8. Define update, compaction, backup, and rebuild procedures.
9. Test node loss and recovery if distributed.
10. Record safe operating ranges and capacity thresholds.

## Decision points
Favor exact search for small corpora when it meets latency. Use ANN when scale demands it. Partition only when it improves isolation, filtering, or operational scale without harming recall.

## Common failure patterns
Default ANN parameters; benchmark without filters; uncontrolled shard proliferation; no rebuild capacity; treating vector database durability as automatic backup.

## Verification
Compare ANN against exact neighbors on samples, load-test percentiles, and exercise recovery/rebuild procedures.

## Expected output
A capacity-tested index design with explicit recall/latency trade-offs.

## Stop conditions
Stop before irreversible topology changes when backup, capacity, or recovery evidence is missing.