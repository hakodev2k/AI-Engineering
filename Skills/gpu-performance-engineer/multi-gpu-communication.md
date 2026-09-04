# Multi-GPU Communication

## Purpose
Diagnose and optimize collective communication and point-to-point data movement so multi-GPU workloads scale efficiently without hiding correctness or topology problems.

## When to use
Use when scaling efficiency drops with additional GPUs, NCCL operations dominate timelines, communication fails to overlap with compute, or performance varies by node/topology.

## Inputs
- Single- and multi-GPU baselines
- NCCL/system traces
- GPU and network topology
- Tensor/message sizes
- Parallelism strategy and synchronization points

## Context to inspect
Inspect NVLink/PCIe/InfiniBand paths, rank placement, collective type, bucket sizes, communication frequency, stream dependencies, gradient synchronization, and imbalance among ranks.

## Core knowledge
Communication cost depends on topology, message size, collective algorithm, synchronization, and overlap. Scaling should be evaluated against useful work per device, not GPU count alone.

## Procedure
1. Measure single-GPU throughput and establish ideal scaling bounds.
2. Quantify communication time and exposed versus overlapped portions.
3. Map rank placement to physical topology.
4. Identify dominant collectives and message-size distributions.
5. Check straggler ranks and load imbalance.
6. Tune bucket/message aggregation where appropriate.
7. Evaluate communication-compute overlap with correct stream dependencies.
8. Test alternative parallelism or sharding strategies if communication volume is structural.
9. Re-measure strong and weak scaling.
10. Validate across nodes and topology variants used in production.

## Decision points
Aggregate small messages when latency dominates. Split or pipeline large communication when overlap is feasible. Change data/model/tensor/pipeline parallelism when the communication pattern is fundamentally mismatched to topology.

## Common failure patterns
- Reporting aggregate utilization instead of scaling efficiency
- Ignoring rank-to-device topology
- Excessive synchronization around collectives
- Tuning NCCL without addressing load imbalance
- Comparing multi-GPU runs with different effective batch semantics

## Verification
Confirm improved scaling efficiency, lower exposed communication time, stable correctness, and no new memory or convergence regressions.

## Expected output
A communication diagnosis with topology evidence, scaling curves, bottleneck cause, implemented mitigation, and residual limits.

## Stop conditions
Stop when network/topology constraints require infrastructure changes outside scope, or when further scaling would violate convergence, latency, or cost requirements.