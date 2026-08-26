# Kernel Fusion and Graph Optimization

## Purpose
Reduce launch, synchronization, and intermediate-memory costs by safely fusing operations or optimizing execution graphs.

## When to use
Use when timelines show many small kernels, repeated materialization, launch-bound execution, or avoidable graph barriers.

## Inputs
Execution graph, tensor shapes, kernel timings, dependency graph, compiler/framework capabilities, numerical requirements.

## Preconditions
Establish graph-level correctness and a representative end-to-end baseline.

## Context to inspect
Inspect producer-consumer chains, intermediate lifetimes, shape specialization, side effects, aliasing, synchronization, fusion support, compilation cache, and generated kernels.

## Core knowledge
Fusion can eliminate memory round trips and launches but may increase register pressure, reduce occupancy, duplicate compute, enlarge compilation cost, or prevent reuse of optimized library kernels. Graph capture can reduce host overhead but imposes constraints on dynamic behavior.

## Procedure
1. Profile and identify launch- or memory-materialization overhead.
2. Map dependencies and side effects.
3. Select fusion candidates with compatible iteration spaces and lifetimes.
4. Estimate saved traffic/launches versus added resource pressure.
5. Prefer compiler/framework fusion before bespoke kernels.
6. Implement one fusion boundary.
7. Inspect generated code and resource usage.
8. Test numerical equivalence and dynamic shapes.
9. Benchmark across representative sizes.
10. Evaluate compilation latency and cache behavior.
11. Keep the change only if end-to-end performance improves.

## Decision points
Fuse bandwidth-bound elementwise chains aggressively when resource pressure remains controlled. Avoid fusion that swallows highly tuned GEMM/convolution primitives without evidence. Use graph capture for stable execution structures where host launch overhead is material.

## Common failure patterns
Over-fusion, hidden recomputation, register spills, broken alias semantics, excessive shape specialization, compilation explosions, graph invalidation, and microbenchmark wins with end-to-end regressions.

## Verification
Verify outputs, generated kernel count, memory traffic, launch count, resource usage, compile/cache overhead, and end-to-end latency/throughput.

## Expected output
A justified fusion/graph plan and measured implementation with documented constraints.

## Stop conditions
Stop when semantics or aliasing are unclear, dynamic behavior invalidates the optimization, compilation cost dominates, or the optimized library path is faster.