# Storage and I/O Capacity Planning

## Purpose
Plan dataset, checkpoint, artifact, and cache storage throughput and capacity so AI workloads are not starved by I/O.

## When to use
Use for training growth, dataset expansion, checkpoint delays, artifact retention changes, or cluster scaling.

## Inputs
Dataset sizes, read/write rates, checkpoint sizes and cadence, retention, cache hit rates, concurrency, storage tiers, restore objectives.

## Preconditions
Workload I/O profiles and retention requirements are known.

## Context to inspect
Object storage, parallel filesystems, local NVMe, metadata services, caching, data loaders, checkpoint pipelines, replication.

## Core knowledge
Capacity planning must cover bytes stored, throughput, IOPS, metadata pressure, recovery bursts, and locality. Training can waste expensive GPU time while waiting on storage.

## Procedure
1. Inventory datasets, checkpoints, artifacts, and temporary data.
2. Measure sequential and metadata-heavy access patterns.
3. Model concurrent readers and writers.
4. Add checkpoint and restore peaks.
5. Evaluate cache/locality benefits.
6. Size retention and growth.
7. Include replication and failure overhead.
8. Define thresholds for tier expansion.

## Decision points
Use local caching when reuse and locality justify duplication. Prefer cheaper tiers for cold artifacts when restore objectives allow.

## Common failure patterns
Planning only bytes, ignoring metadata bottlenecks, underestimating checkpoint bursts, and retaining temporary artifacts indefinitely.

## Verification
Load tests sustain required data rate while accelerators remain fed and restore objectives are met.

## Expected output
Storage capacity and throughput requirements with tiering and growth triggers.

## Stop conditions
Escalate when retention or compliance requirements are unresolved.