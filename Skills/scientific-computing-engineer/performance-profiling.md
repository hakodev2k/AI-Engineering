# Performance Profiling

## Purpose
Identify the real runtime, memory, I/O, and scalability bottlenecks in scientific software before optimizing.

## When to use
Use when simulations are too slow, workloads scale poorly, memory pressure is high, or performance regresses.

## Inputs
Representative workloads, profiling tools, hardware details, build configuration, baseline timings, and performance targets.

## Context to inspect
CPU hotspots, vectorization, cache behavior, allocation, I/O, communication, synchronization, accelerator utilization, and compiler flags.

## Core knowledge
Scientific performance is often limited by memory bandwidth, data movement, communication, or algorithm choice rather than instruction count. Profiling must use release-like builds and representative problem sizes.

## Procedure
1. Establish reproducible end-to-end baselines.
2. Confirm workload representativeness.
3. Profile wall time and call paths.
4. Inspect CPU, memory, cache, I/O, and communication metrics.
5. Distinguish algorithmic from implementation bottlenecks.
6. Form one optimization hypothesis at a time.
7. Change the smallest relevant component.
8. Rebenchmark under identical conditions.
9. Check numerical equivalence and resource regressions.
10. Record results and rejected optimizations.

## Decision points
Optimize algorithms before microarchitecture when asymptotic cost dominates. Prefer library kernels when they meet correctness and portability requirements.

## Common failure patterns
Debug-build profiling, microbenchmarks disconnected from production, optimizing cold paths, ignoring data transfer, and accepting speedups that alter numerical results.

## Verification
Repeat benchmarks, quantify variance, compare before/after metrics, and verify scientific outputs remain within accepted error bounds.

## Expected output
A bottleneck report with measured evidence, implemented optimizations, remaining constraints, and reproducible benchmarks.

## Stop conditions
Stop when measurements are too noisy or representative workloads cannot be reproduced.