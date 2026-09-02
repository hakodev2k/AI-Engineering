# Parallel Computing

## Purpose
Parallelize scientific workloads safely across threads, processes, accelerators, or nodes while preserving numerical correctness and scalability.

## When to use
Use when runtime exceeds requirements, problem size grows, or existing parallel code suffers contention, imbalance, or poor scaling.

## Inputs
Hotspot profile, algorithm dependencies, data layout, hardware topology, memory limits, communication costs, and correctness tolerances.

## Context to inspect
Shared state, reductions, synchronization, task granularity, NUMA placement, MPI/OpenMP usage, accelerator kernels, and serial bottlenecks.

## Core knowledge
Parallel speedup is limited by serial work, synchronization, communication, memory bandwidth, load imbalance, and algorithmic structure. Parallel floating-point reductions may change roundoff behavior.

## Procedure
1. Profile before parallelizing.
2. Identify independent work and true dependencies.
3. Estimate computation-to-communication ratio.
4. Choose thread, process, distributed, or accelerator parallelism.
5. Define data ownership and synchronization.
6. Minimize shared mutable state.
7. Control task granularity and scheduling overhead.
8. Measure strong and weak scaling.
9. Investigate NUMA, bandwidth, and communication bottlenecks.
10. Validate numerical differences introduced by execution order.

## Decision points
Use shared memory for tightly coupled work on one node; use distributed memory when datasets or compute exceed a node; combine models only when complexity is justified by measured gains.

## Common failure patterns
Parallelizing cold code, false sharing, global locks, excessive collectives, tiny tasks, oversubscription, and claiming scalability from one problem size.

## Verification
Compare parallel results against trusted serial/reference results, run race-detection tools where applicable, and record scaling efficiency across supported hardware.

## Expected output
A parallel execution design with ownership rules, measured scaling, bottleneck analysis, and numerical equivalence criteria.

## Stop conditions
Stop when correctness cannot be established or communication/synchronization cost makes the proposed parallelization counterproductive.