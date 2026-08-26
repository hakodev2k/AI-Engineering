# Multi-GPU Topology and Collectives

## Purpose
Design and troubleshoot multi-GPU communication with topology-aware placement and collective algorithms.

## When to use
Use for distributed training, HPC collectives, multi-GPU inference, scaling regressions, or peer-transfer failures.

## Inputs
Node topology, GPU/NIC inventory, process placement, collective traces, message sizes, framework configuration, scaling targets.

## Preconditions
Know physical connectivity and obtain a correct single-GPU baseline.

## Context to inspect
Inspect PCIe/NVLink-class links, NUMA, NIC affinity, peer access, ranks, collective algorithms, message sizes, overlap, synchronization, transport selection, and network fabric.

## Core knowledge
Collective cost depends on topology, algorithm, message size, contention, and synchronization. Ring, tree, hierarchical, reduce-scatter/all-gather and point-to-point patterns have different latency/bandwidth trade-offs. Placement can dominate software tuning.

## Procedure
1. Inventory physical and logical topology.
2. Verify peer and NIC connectivity.
3. Map ranks/processes to GPUs and CPU NUMA nodes deliberately.
4. Benchmark point-to-point and standard collectives by message size.
5. Profile the real workload and quantify communication fraction.
6. Detect serialization, imbalance, topology crossings, and transport fallback.
7. Select topology-appropriate collective/placement settings.
8. Overlap communication with independent compute where dependencies permit.
9. Test failure handling and initialization behavior.
10. Measure strong/weak scaling and efficiency.

## Decision points
Use hierarchical collectives across slow boundaries. Prefer topology-aware placement before increasing concurrency. Overlap only when it does not starve kernels or saturate shared links.

## Common failure patterns
Wrong rank-to-device mapping, cross-NUMA traffic, disabled peer access, unexpected PCIe fallback, collective mismatch/deadlock, tiny-message latency domination, oversubscribed links, and judging scaling from GPU utilization alone.

## Verification
Verify topology mapping, collective correctness, bandwidth/latency microbenchmarks, end-to-end scaling efficiency, absence of deadlocks, and repeatability under target node counts.

## Expected output
A topology map, communication decomposition, tuned placement/collective strategy, and scaling evidence.

## Stop conditions
Stop when topology cannot be determined, fabric health is degraded, collective semantics differ across ranks, or required cluster privileges are unavailable.