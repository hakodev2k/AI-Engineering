# Kernel and Operator Optimization

## Purpose
Improve expensive model operators through better kernels, fusion, layouts, and hardware-specific execution.

## When to use
After profiling proves model kernels dominate the optimization target.

## Inputs
Operator profiles, tensor shapes/dtypes, hardware, framework/compiler, numerical tolerances, baseline.

## Preconditions
Have representative microbenchmarks plus end-to-end tests.

## Context to inspect
Inspect kernel occupancy, memory traffic, launch count, tensor layouts, fusion opportunities, synchronization, supported vendor libraries, and generated code.

## Core knowledge
Kernel speed depends on arithmetic intensity, memory locality, parallelism, launch overhead, and shape. A faster microkernel matters only if it reduces critical-path time.

## Procedure
1. Rank expensive operators by critical-path contribution.
2. Verify existing optimized library/compiler alternatives.
3. Build representative operator benchmarks.
4. Test fusion, layout, algorithm, and precision alternatives.
5. Inspect hardware counters and numerical error.
6. Validate across relevant shapes.
7. Integrate the smallest maintainable improvement.
8. Benchmark end to end.
9. Test fallback paths and unsupported shapes.
10. Document hardware/runtime assumptions.

## Decision points
Prefer maintained vendor/compiler kernels over custom code when performance is comparable. Write custom kernels only for durable, high-impact gaps.

## Common failure patterns
Microbenchmark wins with end-to-end regressions, hidden synchronization, shape overfitting, excessive numerical drift, and unmaintainable hardware-specific code.

## Verification
Target kernels improve across representative shapes and yield statistically meaningful end-to-end gains with accepted numerical behavior.

## Expected output
Optimized operator path, benchmark evidence, compatibility matrix, correctness tests, and fallback.

## Stop conditions
Stop when gains are negligible, correctness cannot be maintained, or required low-level changes exceed approved maintenance/security boundaries.