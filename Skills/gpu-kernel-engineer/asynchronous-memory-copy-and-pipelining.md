# Asynchronous Memory Copy and Pipelining

## Purpose
Overlap data movement with computation using asynchronous copy, staged buffering, and software pipelines.

## When to use
Use when tiled kernels stall on global-to-shared transfers and the target architecture supports asynchronous movement or multistage pipelines.

## Inputs
Kernel source, tile design, memory hierarchy, supported async-copy primitives, profiler latency metrics, and representative workloads.

## Context to inspect
Copy granularity, alignment, stage count, barrier semantics, shared-memory capacity, producer-consumer ordering, and occupancy impact.

## Core knowledge
Pipelining can hide memory latency by loading future tiles while computing current tiles. More stages consume additional shared memory and registers, so deeper pipelines are not automatically faster.

## Procedure
1. Confirm memory latency is limiting useful issue.
2. Identify a repeated load-compute pattern with predictable tiles.
3. Determine supported async copy granularity and alignment.
4. Design double or multistage buffering with explicit ownership.
5. Issue future-stage copies before current-stage compute completes.
6. Use the minimum synchronization required to guarantee readiness.
7. Check shared-memory and register growth from additional stages.
8. Sweep stage counts and tile sizes.
9. Validate prologue, steady-state, epilogue, and partial-tile behavior.
10. Compare stall metrics and end-to-end runtime with the synchronous baseline.

## Decision points
Use deeper pipelines when latency remains exposed and resource headroom exists. Prefer simpler synchronous staging when the kernel is compute-bound or tiles are too small to amortize pipeline overhead.

## Common failure patterns
Incorrect barrier ordering; consuming data before copy completion; excessive stages lowering occupancy; misaligned async copies; and adding complexity where memory latency is not the bottleneck.

## Verification
Run race and correctness tests, inspect memory-stall counters, verify expected overlap in profiler timelines, and measure speedup across target shapes.

## Expected output
A staged pipeline design with synchronization rules and benchmark evidence.

## Stop conditions
Stop when target hardware lacks required semantics or correctness depends on ordering not guaranteed by the programming model.