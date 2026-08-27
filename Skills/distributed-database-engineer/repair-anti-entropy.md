# Repair and Anti-Entropy

## Purpose
Detect and reconcile replica divergence without overwhelming production or masking underlying correctness failures.

## When to use
Use for eventually consistent stores, checksum mismatches, missed replication, tombstone issues, or scheduled repair design.

## Inputs
Replica topology, repair mechanism, dataset size, mutation rate, consistency expectations, maintenance capacity.

## Context to inspect
Repair history, checksums/Merkle structures, replication logs, tombstones, compaction, per-replica divergence metrics, and network capacity.

## Core knowledge
Anti-entropy repairs convergence after missed updates but consumes I/O, CPU, and bandwidth. Repair frequency must relate to retention/tombstone windows. Repairing corrupted state without understanding authority can propagate damage.

## Procedure
1. Identify divergence scope and likely cause.
2. Establish authoritative comparison semantics.
3. Measure repair backlog and available headroom.
4. Prioritize correctness-critical or aging ranges.
5. Throttle repair to protect foreground traffic.
6. Monitor network, disk, compaction, and latency.
7. Verify repaired replicas converge.
8. Investigate recurring divergence separately.
9. Schedule repairs within deletion/retention safety windows.

## Decision points
Use incremental targeted repair for localized divergence; full repair when metadata cannot bound affected ranges and capacity permits it.

## Common failure patterns
Running repair too late for tombstones, saturating disks, repairing from an untrusted replica, treating recurring divergence as normal, and overlapping repair with heavy maintenance.

## Verification
Compare checksums or logical samples after repair and confirm divergence metrics return to baseline without foreground SLO breach.

## Expected output
A repair plan, throttling controls, convergence evidence, and root-cause follow-up.

## Stop conditions
Stop if authoritative state cannot be determined, repair worsens production SLOs beyond limits, or corruption is suspected.