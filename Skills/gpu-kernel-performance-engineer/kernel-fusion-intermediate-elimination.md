# Kernel Fusion and Intermediate Elimination

## Purpose
Reduce launch overhead and global-memory traffic by combining compatible operations while preserving parallel efficiency, debuggability, and resource usage.

## When to use
Use when adjacent kernels materialize large intermediates, launch many tiny operations, or spend more time on memory movement than useful arithmetic.

## Inputs
Kernel DAG, tensor/array lifetimes, profiler timeline, intermediate sizes, register/shared-memory usage, dependency and reuse patterns, numerical constraints.

## Preconditions
Each unfused operation must have a correct baseline. Understand which intermediates are externally observable or reused by multiple consumers.

## Context to inspect
Inspect producer-consumer locality, launch frequency, intermediate traffic, fusion legality, live ranges, register pressure, occupancy, synchronization needs, and whether fusion changes scheduling flexibility.

## Core knowledge
Fusion trades fewer launches and fewer memory round trips for larger kernels with more live state and potentially lower occupancy. The best fusion boundary is determined by end-to-end cost, not by minimizing kernel count.

## Procedure
1. Rank adjacent kernel pairs or chains by intermediate bytes and launch overhead.
2. Check data dependencies and whether the intermediate has multiple consumers.
3. Estimate traffic eliminated by keeping values in registers/shared memory.
4. Implement the smallest promising fusion candidate.
5. Inspect register count, spills, shared-memory use, and generated code.
6. Measure fused versus unfused end-to-end runtime.
7. Test representative shapes, especially small and large extremes.
8. Keep expensive or highly reusable stages separate when fusion harms scheduling.
9. Preserve useful profiling boundaries through annotations or debug modes where possible.
10. Document why the chosen boundary is stable.

## Decision points
Fuse bandwidth-bound elementwise chains aggressively when resource growth is modest. Avoid fusion when it duplicates work, prevents parallel overlap, inflates registers, or combines kernels with incompatible launch geometries.

## Common failure patterns
Fusing everything; judging by kernel count; ignoring spill traffic; duplicating a producer for multiple consumers; losing numerical equivalence through changed reassociation; making production debugging opaque.

## Verification
Confirm lower end-to-end runtime and intermediate traffic, acceptable resource usage, identical or tolerance-valid results, and no regression across workload sizes.

## Expected output
A measured fusion boundary with eliminated traffic, resource trade-offs, and correctness evidence.

## Stop conditions
Escalate when fusion requires major compiler/runtime changes, violates observability requirements, or resource pressure erases the expected benefit.