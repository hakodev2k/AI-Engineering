# Register Pressure and Occupancy Tuning

## Purpose
Balance per-thread register use, resident warps, instruction efficiency, and spilling so a GPU kernel has enough active work to hide latency without sacrificing useful local state.

## When to use
Use when a hot kernel has low occupancy, high register allocation, spill traffic, unexplained latency stalls, or compiler changes alter performance materially.

## Inputs
Compiler resource report, profiler occupancy and stall metrics, generated assembly/intermediate code, launch geometry, target architecture, representative workload.

## Preconditions
Establish a correct baseline and avoid treating occupancy percentage as the objective by itself.

## Context to inspect
Inspect registers per thread, threads per block, shared-memory use, architectural register-file limits, active blocks/warps, local-memory spill loads/stores, loop unrolling, inlining, live ranges, and dependency chains.

## Core knowledge
Higher occupancy improves latency-hiding capacity only until enough independent warps are available. Artificially limiting registers can cause spills or extra recomputation. Compiler allocation is shaped by live ranges, unrolling, inlining, and code structure.

## Procedure
1. Record register count, occupancy, spill traffic, and runtime.
2. Identify the hardware resource limiting residency.
3. Check whether profiler stalls indicate inadequate latency hiding.
4. Inspect code regions creating large live ranges or temporary arrays.
5. Reduce unnecessary live state through scoping, recomputation, or algorithm restructuring.
6. Test launch-size changes that alter residency.
7. Use compiler register caps only as controlled experiments.
8. Inspect generated code for spills and instruction growth.
9. Benchmark across supported shapes and architectures.
10. Keep the configuration with the best stable runtime, not the highest occupancy.

## Decision points
Accept lower occupancy when a kernel has strong instruction-level parallelism or high reuse. Trade recomputation for registers only when it reduces critical-path cost. Prefer structural fixes over forced register limits.

## Common failure patterns
Chasing 100% occupancy; hiding spill traffic in cache; changing block size without considering shared memory; over-unrolling loops; using compiler caps globally.

## Verification
Confirm runtime improvement, stable or reduced spill traffic, acceptable occupancy, unchanged correctness, and no major regression across representative devices.

## Expected output
A resource-pressure diagnosis and measured register/occupancy configuration with rationale.

## Stop conditions
Escalate when compiler allocation is opaque, required changes substantially reduce maintainability, or optimization depends on unsupported architecture-specific controls.