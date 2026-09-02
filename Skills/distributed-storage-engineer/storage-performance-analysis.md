# Storage Performance Analysis

## Purpose
Diagnose and improve distributed-storage latency, throughput, and efficiency using measured evidence across client, network, coordination, cache, storage-engine, and device layers.

## When to use
Use when p95/p99 latency rises, throughput plateaus, tail behavior becomes unstable, or resource use grows disproportionately with load.

## Inputs
Latency histograms, throughput, CPU, memory, disk, network, cache, queue, replication, compaction, and request-trace data plus representative workload definitions.

## Preconditions
Have a reproducible workload or sufficiently detailed production telemetry. Preserve correctness and durability requirements while optimizing.

## Context to inspect
Client retries, request routing, quorum waits, queues, caches, serialization, storage engine, device I/O, compaction, replication lag, and background maintenance.

## Core knowledge
Average latency hides queueing and stragglers. Distributed requests often inherit the slowest dependency or replica. Bottlenecks migrate as load changes. Performance changes must be evaluated in steady state, including compaction, repair, and cache warm-up.

## Procedure
1. Define the user-visible SLO and workload slice.
2. Compare latency percentiles, throughput, and error rates over time.
3. Decompose request latency by stage.
4. Inspect saturation and queue depth for CPU, disk, and network.
5. Compare healthy and slow partitions/nodes.
6. Measure cache effectiveness and amplification.
7. Identify coordination, replication, or straggler contribution.
8. Check background compaction, repair, and rebalancing pressure.
9. Form one measurable bottleneck hypothesis.
10. Change one controlled variable.
11. Benchmark long enough to reach steady state.
12. Verify gains across representative workloads and failure states.

## Decision points
Optimize the dominant resource rather than the most visible metric. Scale out when load is partitionable and coordination overhead remains bounded; scale up when a shared bottleneck or working-set constraint dominates.

## Common failure patterns
Using averages, benchmarking warm caches only, disabling durability for favorable numbers, ignoring background work, optimizing synthetic point reads while production scans dominate, and moving the bottleneck elsewhere unnoticed.

## Verification
Compare before/after distributions, resource saturation, amplification, and generated load at equal correctness settings. Require sustained improvement rather than a short benchmark spike.

## Expected output
A bottleneck diagnosis, evidence, chosen remediation, benchmark results, and remaining performance risks.

## Stop conditions
Stop when measurements are not representative or optimization would weaken required consistency, durability, or isolation guarantees.