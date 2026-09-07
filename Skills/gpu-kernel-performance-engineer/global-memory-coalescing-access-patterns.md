# Global Memory Coalescing and Access Patterns

## Purpose
Optimize global-memory access so neighboring GPU lanes generate efficient transactions, minimize wasted bandwidth, and preserve useful locality across realistic tensor and array layouts.

## When to use
Use when a profiler shows high memory traffic, low effective bandwidth, poor load/store efficiency, or performance changes sharply with strides, shapes, or layouts.

## Inputs
Kernel code, data layout, strides, access formulas, profiler memory metrics, element size, alignment guarantees, representative shapes.

## Preconditions
Correctness must be stable and indexing semantics understood. Know the hardware warp/wavefront width and transaction granularity at a practical level.

## Context to inspect
Inspect lane-to-address mapping, alignment, stride, vector width, boundary handling, structure-of-arrays versus array-of-structures layout, gather/scatter behavior, cache use, and whether accesses are read-only or write-heavy.

## Core knowledge
Coalescing is about how active lanes' addresses combine into memory transactions, not merely whether addresses are consecutive in source code. Misalignment, stride, sparse masks, and poor field layout can inflate traffic. Layout changes can improve one kernel while harming another, so optimize end-to-end dataflow.

## Procedure
1. Write the exact address expression for each lane.
2. Test common and worst-case shapes and alignments.
3. Measure requested versus transferred bytes where tooling exposes them.
4. Map contiguous logical dimensions to adjacent lanes when practical.
5. Reorder or transpose data only when reuse across downstream kernels justifies the cost.
6. Consider structure-of-arrays for independently consumed fields.
7. Use vectorized loads/stores only when alignment and register cost are safe.
8. Remove redundant loads and avoid rereading values already resident in registers or shared memory.
9. Re-profile transaction efficiency and effective bandwidth.
10. Verify that any layout change improves end-to-end runtime, not just one kernel.

## Decision points
Prefer layout changes when they benefit multiple hot operations. Use explicit staging or transposition when repeated reuse amortizes the conversion. Accept imperfect coalescing when access semantics are inherently sparse and alternative representations cost more.

## Common failure patterns
Assuming contiguous source indices guarantee coalescing; ignoring tail masks; vectorizing unaligned addresses; optimizing one producer while penalizing all consumers; measuring bandwidth without accounting for extra transactions.

## Verification
Confirm lower memory transactions or bytes, improved effective bandwidth or runtime, correct results across alignment and tail cases, and no regression in adjacent kernels.

## Expected output
A documented lane-to-address analysis, justified layout or indexing change, and profiler-backed performance evidence.

## Stop conditions
Escalate when data layout is externally fixed, sparse access is intrinsic to the algorithm, or changing representation requires cross-system coordination beyond the optimization scope.