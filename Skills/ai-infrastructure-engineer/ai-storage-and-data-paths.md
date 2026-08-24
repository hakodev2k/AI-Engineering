# AI Storage and Data Paths

## Purpose
Design storage and data paths that feed accelerators fast enough for training and serving while controlling cost, consistency, and failure risk.

## When to use
Use for dataset bottlenecks, checkpoint pressure, model loading, or large-scale AI platform design.

## Inputs
Dataset sizes, access patterns, checkpoint frequency, model artifact sizes, throughput/latency targets, storage options.

## Context to inspect
Object/file/block storage, local cache, network bandwidth, metadata operations, shard layout, read amplification, lifecycle policy, and failure modes.

## Core knowledge
AI I/O patterns often combine large sequential reads, many small metadata operations, checkpoints, and repeated model loads. Caching and sharding help only when aligned with access locality and consistency needs.

## Procedure
1. Characterize read/write patterns per workload.
2. Measure current throughput, latency, cache hit rate, and metadata overhead.
3. Separate authoritative storage from ephemeral caches.
4. Design shard sizes and parallelism to match workers.
5. Size checkpoint and model-loading bandwidth.
6. Avoid cross-region or cross-zone paths unless justified.
7. Define cache invalidation and lifecycle rules.
8. Test degraded storage and cache-miss scenarios.
9. Re-measure accelerator idle time due to I/O.

## Decision points
Use local/NVMe cache for hot repeatable data; object storage for durable scale; distributed filesystems when shared POSIX semantics materially help.

## Common failure patterns
Tiny-file explosions, synchronized checkpoint storms, unbounded local caches, remote data paths saturating links, and measuring storage without GPU stall time.

## Verification
Confirm workload throughput, accelerator utilization, recovery behavior, and storage cost under representative load.

## Expected output
A validated storage architecture and data-path operating envelope.

## Stop conditions
Stop when data access semantics or durability requirements are unclear.