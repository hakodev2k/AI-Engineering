# Compiler and Kernel Optimization

## Purpose
Improve inference performance through graph compilation, operator fusion, optimized kernels, and shape specialization while preserving correctness and maintainability.

## When to use
Use after profiling shows operator or launch inefficiency and before resorting to custom low-level kernel development.

## Inputs
Model graph, target hardware, runtime/compiler options, profiler traces, tensor shapes, precision configuration, and correctness tests.

## Context to inspect
Inspect graph breaks, unsupported operators, dynamic shapes, fusion opportunities, kernel selection, compilation cache behavior, and startup latency.

## Core knowledge
Compilers can remove dispatch overhead, fuse memory-bound operations, specialize shapes, and select hardware-specific kernels. Benefits depend on graph stability and shape distributions; aggressive specialization can increase compile time and cache fragmentation.

## Procedure
1. Establish an eager/runtime baseline.
2. Capture graph breaks and expensive operator traces.
3. Enable supported compilation modes incrementally.
4. Confirm operator coverage and generated kernel selection.
5. Test representative static and dynamic shapes.
6. Measure compile time separately from steady-state latency.
7. Evaluate fusion and memory-traffic reduction.
8. Inspect numerical differences against baseline.
9. Benchmark warm and cold behavior.
10. Pin compiler/runtime versions and record compatibility constraints.

## Decision points
Prefer standard optimized kernels when gains are sufficient and portability matters. Use shape specialization for stable shapes. Consider custom kernels only for persistent critical-path gaps with enough volume to justify maintenance.

## Common failure patterns
Benchmarking compile time as inference time, ignoring graph breaks, over-specializing rare shapes, accepting silent fallback paths, and shipping compiler upgrades without numerical regression testing.

## Verification
Verified means end-to-end latency or throughput improves on representative shapes, compilation remains operationally acceptable, and numerical tests pass within approved tolerance.

## Expected output
Compiler configuration, kernel evidence, benchmark results, compatibility notes, and rollback path.

## Stop conditions
Escalate on unexplained numerical divergence, compiler instability, unsupported critical operators, or generated-code failures that cannot be safely isolated.