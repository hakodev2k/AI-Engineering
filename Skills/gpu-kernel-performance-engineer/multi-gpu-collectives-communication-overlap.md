# Multi-GPU Collectives and Communication Overlap

## Purpose
Optimize GPU workloads that span multiple devices by reducing collective communication cost, choosing topology-aware decomposition, and overlapping transfers with useful computation where dependencies allow.

## When to use
Use for data-parallel or model-parallel workloads, distributed reductions, all-gather/reduce-scatter phases, peer-to-peer exchanges, or when scaling efficiency degrades as GPU count increases.

## Inputs
Work decomposition, collective pattern, tensor sizes, interconnect topology, device placement, communication library traces, stream dependencies, per-device compute profile, scaling target.

## Preconditions
Single-device correctness and performance should be characterized first. Identify the exact collective semantics and whether all participating devices must progress together.

## Context to inspect
Inspect PCIe/NVLink or equivalent topology, NUMA placement, peer-access availability, collective algorithm selection, message size, chunking, rank imbalance, stream priorities, synchronization, host staging, and whether compute can proceed on partial data.

## Core knowledge
Multi-GPU scaling is limited by both communication volume and synchronization. Collective libraries select algorithms based on topology and size, but placement and workload imbalance can still dominate. Overlap helps only when communication and compute use sufficiently independent resources and dependencies are chunkable.

## Procedure
1. Measure single-device baseline and ideal scaling ceiling.
2. Capture per-rank timelines and rank-to-device topology.
3. Quantify communication bytes and time for each collective.
4. Identify load imbalance before tuning communication.
5. Verify peer-to-peer paths and avoid unintended host staging.
6. Choose or validate collective decomposition appropriate to message sizes and topology.
7. Chunk communication only when chunks can feed downstream compute incrementally.
8. Use separate streams/events to overlap communication with independent computation.
9. Measure overlap, exposed communication time, and compute slowdown from contention.
10. Benchmark weak and strong scaling across representative device counts.

## Decision points
Use reduce-scatter/all-gather instead of all-reduce when the algorithm can consume sharded results. Favor larger messages for efficiency unless pipelining latency dominates. Accept some serialization when communication and compute compete for the same limiting memory/interconnect resource.

## Common failure patterns
Assuming more GPUs imply linear speedup; ignoring rank imbalance; oversplitting messages; staging through host memory unnecessarily; adding streams without dependency freedom; tuning collectives before fixing a slow rank.

## Verification
Confirm improved scaling efficiency, reduced exposed communication time, correct collective results, balanced rank timelines, and stable behavior across supported topologies.

## Expected output
A topology-aware communication plan with measured scaling, overlap strategy, and documented placement assumptions.

## Stop conditions
Escalate when topology or fabric configuration is controlled externally, collective failures indicate driver/fabric faults, or algorithmic communication volume must change at a higher architecture layer.