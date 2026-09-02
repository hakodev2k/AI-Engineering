# Compaction and Garbage Collection

## Purpose
Design and tune compaction and garbage-collection workflows that reclaim space safely without destabilizing foreground traffic or violating retention semantics.

## When to use
Use when storage amplification grows, tombstones accumulate, obsolete versions persist, disk utilization rises unexpectedly, or background maintenance causes latency spikes.

## Inputs
Storage format, version-retention rules, tombstone policy, snapshot lifetimes, compaction metrics, free-space levels, disk bandwidth, and workload latency SLOs.

## Preconditions
Understand which data versions are still reachable by active snapshots, replication, backup, or recovery processes.

## Context to inspect
Compaction scheduler, segment or SSTable lifecycle, tombstones, TTL processing, snapshot references, garbage collectors, disk allocator, throttles, and cleanup safety checks.

## Core knowledge
Reclamation is constrained by reachability and retention, not merely age. Compaction can amplify reads and writes and may require temporary free space. Tombstones must remain long enough to prevent deleted data from reappearing on lagging replicas. Snapshot retention can pin large amounts of old data.

## Procedure
1. Quantify space amplification and obsolete-data age.
2. Identify all references that can keep data live.
3. Define safe deletion and tombstone-retention rules.
4. Select compaction trigger and scheduling strategy.
5. Estimate temporary disk and I/O requirements.
6. Prioritize compaction by risk, benefit, and workload heat.
7. Throttle against foreground latency and recovery reserve.
8. Make compaction restartable after interruption.
9. Validate output before deleting source data.
10. Track pinned data from snapshots and long-running readers.
11. Alert on compaction debt and free-space risk.
12. Test cleanup after node outages and replica lag.

## Decision points
Use aggressive reclamation when free space is scarce and retention constraints allow it; favor lower background pressure when latency SLOs dominate. Choose size-, level-, or age-oriented strategies according to storage-engine characteristics.

## Common failure patterns
Deleting versions still needed by snapshots, tombstone resurrection, running out of temporary disk, compaction storms, starvation of cold partitions, and hiding long-lived snapshot leaks.

## Verification
Measure reclaimed space, write/read amplification, foreground tail latency, and recovery after interrupted compaction. Confirm no retained or deleted data violates policy.

## Expected output
A compaction and garbage-collection policy with safety criteria, prioritization, throttling, metrics, and tested recovery behavior.

## Stop conditions
Stop when liveness of data cannot be determined safely or available disk headroom is insufficient for the planned compaction.