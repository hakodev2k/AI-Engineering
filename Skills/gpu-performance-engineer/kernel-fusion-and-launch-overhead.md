# Kernel Fusion and Launch Overhead

## Purpose
Reduce GPU launch overhead and intermediate memory traffic by deciding when adjacent operations should be fused, captured, batched, or left separate.

## When to use
Use when timelines show many short kernels, large launch gaps, repeated intermediate reads/writes, or framework overhead that is significant relative to compute.

## Inputs
- System timeline
- Kernel sequence and dependencies
- Intermediate tensor/buffer sizes
- Kernel timings and launch frequency
- Register/shared-memory usage

## Context to inspect
Inspect operation dependencies, fusion opportunities, dynamic shapes, synchronization, memory traffic, compiler-generated fusion, and portability constraints.

## Core knowledge
Fusion can remove launches and global-memory round trips, but may increase registers, shared memory, code size, compilation time, and reduce scheduling flexibility. CUDA Graphs or batching can address launch overhead without forcing semantic fusion.

## Procedure
1. Quantify launch overhead and intermediate memory traffic.
2. Rank operation sequences by cumulative impact.
3. Identify producer-consumer pairs with compatible mapping.
4. Estimate additional register and shared-memory pressure from fusion.
5. Prototype fusion or graph capture for the highest-value sequence.
6. Inspect occupancy and spills after fusion.
7. Compare against batching or persistent-kernel alternatives.
8. Measure end-to-end latency and throughput.
9. Test representative dynamic shapes and concurrency.
10. Retain fusion only when gains exceed complexity and portability costs.

## Decision points
Fuse when intermediate traffic and launches dominate and resource growth stays controlled. Prefer CUDA Graphs when launches dominate but kernels are already efficient and stable. Keep kernels separate when fusion causes spills, poor occupancy, or divergent mappings.

## Common failure patterns
- Fusing everything into a monolithic kernel
- Ignoring compiler/runtime fusion already present
- Measuring only kernel sum rather than wall time
- Creating shape-specific fusion with poor production coverage
- Trading debuggability for negligible gains

## Verification
Verify reduced launch count or memory traffic, improved wall-clock latency/throughput, no resource regression that offsets gains, and correct results across supported shapes.

## Expected output
A fusion/launch optimization decision with timeline evidence, implementation, before/after metrics, and maintainability implications.

## Stop conditions
Stop when launch overhead is no longer material or fusion requires unsupported assumptions about shapes, ordering, or numerical semantics.