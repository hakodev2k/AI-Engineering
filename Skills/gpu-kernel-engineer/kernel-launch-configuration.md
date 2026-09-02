# Kernel Launch Configuration

## Purpose
Choose launch dimensions and work decomposition that expose enough parallelism while respecting register, shared-memory, synchronization, and scheduling constraints.

## When to use
Use for new kernels, performance tuning, portability reviews, or regressions caused by block/workgroup geometry.

## Inputs
Kernel source, problem dimensions, GPU limits, resource usage, profiler data, and representative input sizes.

## Context to inspect
Thread/block mapping, dimensionality, boundary handling, register count, shared-memory allocation, occupancy limits, synchronization points, and expected workload variability.

## Core knowledge
Launch shape affects memory coalescing, resource residency, scheduling granularity, tail effects, and synchronization cost. Maximum occupancy is not an objective by itself; the goal is enough active work to hide latency without sacrificing instruction efficiency or data reuse.

## Procedure
1. Define the logical work item and mapping to output/data elements.
2. Determine dimensions that preserve contiguous memory access for adjacent threads.
3. Calculate legal block/workgroup sizes for the target architecture.
4. Estimate residency using registers and shared memory per block.
5. Choose several plausible launch configurations rather than one guessed value.
6. Benchmark across representative problem sizes.
7. Inspect achieved occupancy, eligible warps, issue efficiency, and memory throughput.
8. Check small-size behavior, partial blocks, and tail waves.
9. Prefer stable configurations or runtime selection when workload shapes vary materially.
10. Document architecture-sensitive assumptions.

## Decision points
Use larger blocks when they improve latency hiding and amortize shared state; use smaller blocks when resource pressure or scheduling flexibility dominates. Dynamic launch selection is justified when one static geometry performs poorly across important workload classes.

## Common failure patterns
Choosing block size solely from occupancy calculators; ignoring memory layout; benchmarking only one input size; excessive per-block shared memory; and assuming vendor examples are optimal for a different kernel.

## Verification
Compare candidate configurations under controlled benchmarks, verify correctness for edge dimensions, and confirm profiler metrics support the selected trade-off.

## Expected output
A justified launch policy with benchmark evidence and fallback behavior.

## Stop conditions
Stop when launch geometry cannot be evaluated without representative workloads or when required changes alter numerical semantics without approval.