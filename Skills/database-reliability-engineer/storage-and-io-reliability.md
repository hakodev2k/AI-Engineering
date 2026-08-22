# Storage and IO Reliability

## Purpose
Diagnose and prevent storage latency, throughput, capacity, and durability problems that threaten database reliability.

## When to use
Use for IO waits, storage saturation, sudden latency, capacity pressure, or storage-tier changes.

## Inputs
IOPS, throughput, latency, queue depth, storage capacity, database waits, checkpoint behavior, and provider limits.

## Context to inspect
Data/log/temp placement, volume types, burst credits, filesystem, encryption, snapshots, growth, and failover storage behavior.

## Core knowledge
Database IO patterns differ across logs, data, temp, checkpoints, compaction, and backups. Storage limits may be throughput-, IOPS-, latency-, or capacity-bound.

## Procedure
1. Correlate database waits with storage metrics.
2. Separate read, write, log, and temporary IO patterns.
3. Identify hard limits, throttling, burst exhaustion, or queueing.
4. Check capacity and growth risk.
5. Evaluate workload reduction before scaling blindly.
6. Select storage tier or layout changes based on measured bottleneck.
7. Test durability and recovery assumptions.
8. Monitor after change across peak periods.

## Decision points
Scale storage when workload is efficient but exceeds physical limits; optimize queries/checkpoints when avoidable IO is the root cause.

## Common failure patterns
Provisioning from capacity only, ignoring log latency, burst-credit dependence, snapshots during peaks, and conflating OS cache with durable writes.

## Verification
Compare before/after waits, latency percentiles, queue depth, throughput, and recovery behavior.

## Expected output
Root cause, validated storage remediation, capacity margin, and monitoring thresholds.

## Stop conditions
Escalate suspected storage corruption, durability uncertainty, or changes requiring disruptive volume migration.