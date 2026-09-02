# Storage Engine and LSM Trees

## Purpose
Design, tune, and troubleshoot log-structured storage engines with predictable write amplification, read amplification, space amplification, and recovery behavior.

## When to use
Use when working with LSM-tree-based stores, selecting compaction strategies, tuning memtables/SSTables, or investigating storage-engine latency and capacity anomalies.

## Inputs
Workload distribution, key/value sizes, read/write mix, durability rules, compaction metrics, cache metrics, disk characteristics, and latency targets.

## Preconditions
Have measurements for foreground traffic and background maintenance rather than relying on defaults alone.

## Context to inspect
Write-ahead log, memtables, flush policy, SSTable format, bloom filters, block cache, indexes, compaction levels, tombstones, snapshots, checksums, and recovery code.

## Core knowledge
LSM designs exchange sequential write efficiency for background compaction and potentially higher reads. Compaction strategy determines amplification and latency behavior. Bloom filters reduce unnecessary reads but consume memory. Tombstones and snapshots delay reclamation. Write stalls are often the correct safety mechanism when background work cannot keep up.

## Procedure
1. Characterize workload by operation type, key distribution, value size, and locality.
2. Measure current read, write, and space amplification.
3. Inspect flush frequency and write-ahead-log behavior.
4. Evaluate SSTable size and level or tier configuration.
5. Measure compaction backlog and bandwidth.
6. Inspect bloom-filter effectiveness and block-cache hit rate.
7. Analyze tombstone density and snapshot retention.
8. Identify causes of write stalls or tail-latency spikes.
9. Tune one major variable at a time with a controlled workload.
10. Preserve recovery and durability guarantees while optimizing.
11. Test restart, crash recovery, and partial-compaction handling.
12. Document workload-specific tuning limits.

## Decision points
Use leveled compaction when read and space amplification dominate; consider size-tiered or universal approaches for heavy writes where extra read amplification is acceptable. Increase cache only after confirming useful working-set locality.

## Common failure patterns
Compaction debt, oversized levels, unbounded tombstones, benchmark-only tuning, disabling safety backpressure, cache pollution, excessive flushes, and assuming SSD throughput removes all write amplification concerns.

## Verification
Benchmark steady state long enough to include compaction, verify crash recovery, compare amplification metrics before and after changes, and validate p95/p99 latency under sustained load.

## Expected output
A storage-engine tuning or design decision backed by measured amplification, latency, recovery, and resource trade-offs.

## Stop conditions
Stop when workload measurements are not representative or changes would weaken durability without explicit approval.