# Performance Profiling and Regression Analysis

## Purpose
Measure, attribute, and correct LLM compiler performance regressions using reproducible benchmarks, compiler-stage evidence, and hardware profiling.

## When to use
Use when latency, throughput, compile time, memory, kernel efficiency, or scaling changes after a compiler modification or model update.

## Inputs
- Before/after compiler revisions
- Representative models and shape distributions
- Benchmark harness
- Compiler traces and IR dumps
- Hardware profiler data

## Preconditions
Control hardware, driver/runtime, power state, warmup, batch/sequence configuration, and benchmark methodology well enough to distinguish signal from noise.

## Context to inspect
Inspect compile time, graph/pass changes, kernel count, launch configuration, memory traffic, occupancy, generated code, cache hits, synchronization, host overhead, and end-to-end service metrics.

## Core knowledge
Performance regressions can arise from graph changes, codegen, schedule selection, extra copies, lost fusion, recompilation, cache misses, synchronization, or runtime behavior. Kernel microbenchmarks are useful but end-to-end performance is the final authority. Statistical variation must be quantified.

## Procedure
1. Reproduce the regression with fixed environment and representative inputs.
2. Measure repeated baseline and candidate runs; report distribution, not one sample.
3. Separate compile-time from runtime regression.
4. Compare graph/IR structure, kernel count, copies, and synchronization.
5. Identify the dominant changed kernels or stages.
6. Inspect hardware counters and generated-code differences.
7. Bisect compiler revisions or passes when the cause is unclear.
8. Form one bottleneck hypothesis at a time and test it.
9. Implement the smallest correction or profitability guard.
10. Re-run microbenchmarks and end-to-end benchmarks across the workload matrix.
11. Add a regression threshold to CI where stable and affordable.

## Decision points
Optimize end-to-end objectives rather than isolated kernels. Accept a local slowdown only when it enables a larger downstream gain that is measured. Use hardware counters when timing alone cannot distinguish compute, bandwidth, occupancy, or synchronization bottlenecks.

## Common failure patterns
- Comparing single timings.
- Benchmarking unrepresentative shapes.
- Ignoring compile latency or specialization explosion.
- Claiming improvement from a kernel benchmark while application latency regresses.
- Changing several optimizations simultaneously during diagnosis.

## Verification
Implemented means the suspected cause has a fix. Verified means repeated controlled benchmarks recover target performance across representative shapes without correctness, memory, compile-time, or portability regressions.

## Expected output
A reproducible regression report, evidence-backed root cause, corrected compiler behavior, and benchmark guard where practical.

## Stop conditions
Stop when environmental variance prevents meaningful comparison, the baseline cannot be reproduced, or the regression comes from an external driver/runtime change outside compiler control.