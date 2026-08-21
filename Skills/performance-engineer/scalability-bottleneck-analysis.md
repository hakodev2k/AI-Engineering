# Scalability Bottleneck Analysis

## Purpose
Determine why throughput or latency stops scaling as instances, threads, partitions, or hardware resources are added, and identify the shared constraint that limits growth.

## When to use
Use when scale-out yields diminishing returns, a system has uncertain maximum capacity, or architecture changes are proposed to support major growth.

## Inputs
Capacity curves, workload model, topology, resource metrics, dependency limits, queue/pool metrics, partitioning strategy, and cost data.

## Context to inspect
Inspect shared databases, locks, coordinators, caches, partitions, hot keys, network/storage bandwidth, quotas, connection limits, and serialized work.

## Core knowledge
Scalability is about how performance changes with load and resources, not raw speed at one point. Amdahl-like serial fractions and shared bottlenecks create diminishing returns. Partition skew can defeat nominal horizontal scale.

## Procedure
1. Measure throughput and latency at several load/resource levels.
2. Plot scaling efficiency rather than comparing two points only.
3. Identify the resource or dependency whose utilization approaches saturation first.
4. Check serialized sections and global coordination.
5. Inspect partition/key distribution and hot spots.
6. Measure connection, quota, and bandwidth ceilings.
7. Determine whether the bottleneck can be removed, partitioned, cached, or isolated.
8. Test the candidate architecture at multiple scale points.
9. Evaluate cost per throughput and operational complexity.
10. Document the next expected bottleneck after remediation.

## Decision points
Partition when ownership and access patterns support it; scale shared infrastructure when simpler; redesign coordination only when measured limits justify complexity.

## Common failure patterns
Assuming linear scaling, adding app instances behind one saturated database, ignoring skew, measuring only CPU, and extrapolating far beyond tested capacity.

## Verification
The post-change capacity curve demonstrates improved scaling efficiency and SLO-compliant throughput across multiple tested scale points.

## Expected output
A scalability model with current limiting factor, remediation, and next capacity constraint.

## Stop conditions
Escalate when remediation requires fundamental data ownership or architecture changes beyond approved scope.