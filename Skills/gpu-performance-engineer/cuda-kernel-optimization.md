# CUDA Kernel Optimization

## Purpose
Optimize CUDA kernels by systematically improving execution efficiency without compromising correctness, portability, or maintainability.

## When to use
Use when a CUDA kernel is proven to be material to end-to-end performance and profiler evidence identifies actionable inefficiency.

## Inputs
- Kernel source and launch configuration
- Representative shapes and data distributions
- Baseline runtime and profiler counters
- Numerical correctness tolerances
- Target GPU architectures

## Preconditions
Have a reproducible correctness test and benchmark. Confirm the kernel is on the critical path.

## Context to inspect
Inspect block/grid dimensions, memory access, synchronization, register pressure, shared memory, divergence, instruction mix, occupancy, compiler flags, and architecture-specific features.

## Core knowledge
Kernel speed emerges from interaction among parallelism, memory locality, latency hiding, instruction throughput, and resource limits. Optimizations such as tiling, vectorization, unrolling, shared-memory staging, warp primitives, and fusion have costs as well as benefits.

## Procedure
1. Freeze a baseline benchmark and correctness oracle.
2. Classify the bottleneck using profiler evidence.
3. Inspect access patterns and launch geometry.
4. Remove redundant global-memory traffic and unnecessary synchronization.
5. Improve coalescing and reuse where profitable.
6. Evaluate shared memory or warp-level primitives.
7. Tune block size against registers, shared memory, and occupancy.
8. Inspect generated code for unexpected spills or instructions.
9. Apply one material change at a time.
10. Benchmark across representative shapes and target GPUs.
11. Retain changes only when end-to-end benefit exceeds complexity cost.

## Decision points
Prefer fusion when intermediate traffic dominates and fusion does not create excessive register pressure. Prefer separate kernels when fusion harms scheduling or reuse. Use architecture-specific instructions only when deployment constraints justify them.

## Common failure patterns
- Optimizing unmeasured code
- Increasing occupancy while slowing the kernel
- Excessive shared-memory use
- Register spilling after aggressive unrolling
- Hidden synchronization or divergence
- Speedups limited to one convenient input shape

## Verification
Run correctness tests, numerical-difference checks, repeated microbenchmarks, end-to-end benchmarks, and profiler comparison. Verify behavior on all supported architectures.

## Expected output
An optimized kernel with documented bottleneck, rationale, benchmark evidence, correctness results, and portability considerations.

## Stop conditions
Stop when gains are within measurement noise, numerical requirements are threatened, or further tuning would require unsupported hardware assumptions.