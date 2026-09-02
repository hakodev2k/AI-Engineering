# Performance Benchmarking Methodology

## Purpose
Create trustworthy GPU kernel benchmarks that distinguish real optimization gains from noise, warm-up effects, caching artifacts, and measurement mistakes.

## When to use
Use before and after optimization, when comparing implementations, validating regressions, or choosing architecture-specific variants.

## Inputs
Kernel variants, representative workload shapes, runtime environment, target GPUs, synchronization semantics, and performance objectives.

## Context to inspect
Warm-up behavior, JIT compilation, clock variability, stream ordering, asynchronous execution, allocator effects, cache state, data transfer inclusion, repetition count, and statistical variance.

## Core knowledge
GPU execution is asynchronous, so host wall-clock timing without synchronization is often wrong. Stable benchmarking controls compilation, allocation, clocks where possible, workload distribution, and measurement scope. Microbenchmarks must be tied back to end-to-end impact.

## Procedure
1. Define exactly what latency or throughput interval is being measured.
2. Separate one-time compilation, allocation, and initialization unless they are part of the product path.
3. Warm up kernels and runtime state.
4. Use device events or equivalent synchronization-aware timing.
5. Run enough repetitions to characterize variance.
6. Test representative small, medium, large, and awkward shapes.
7. Record hardware, driver, runtime, compiler, power mode, and relevant environment variables.
8. Report median and distribution, not only the best run.
9. Compare against a stable baseline and trusted library where relevant.
10. Validate that a microbenchmark improvement reduces end-to-end latency or cost.

## Decision points
Include transfers and allocations when the production path includes them. Use isolated kernel timing when diagnosing compute behavior, but label the scope explicitly.

## Common failure patterns
Timing asynchronous launches with host clocks; reporting best-of-N only; benchmarking unrealistic shapes; ignoring JIT warm-up; changing multiple variables at once; and treating statistically insignificant differences as wins.

## Verification
Repeat measurements in clean runs, check variance, confirm synchronization, and reproduce the result on representative target hardware.

## Expected output
A reproducible benchmark protocol and defensible before/after performance evidence.

## Stop conditions
Stop when environmental noise prevents stable measurements or the benchmark does not represent any important production workload.