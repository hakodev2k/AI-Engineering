# GPU Benchmarking and Statistical Measurement

## Purpose
Build trustworthy GPU microbenchmarks and end-to-end measurements that separate warm-up, launch, synchronization, transfer, and kernel execution effects while accounting for noise and device state.

## When to use
Use before and after optimization work, when comparing implementations, validating regressions, or investigating conflicting profiler and wall-clock results.

## Inputs
Benchmark target, representative inputs, timing API, device/runtime configuration, iteration count, correctness oracle, environment metadata.

## Preconditions
The benchmark must execute real work whose outputs cannot be optimized away. Synchronization semantics of the timing method must be understood.

## Context to inspect
Inspect JIT/compile warm-up, allocator warm-up, caches, GPU clocks, power/thermal state, asynchronous execution, host timers, stream events, background workloads, CPU affinity, data-transfer inclusion, and input distributions.

## Core knowledge
GPU APIs are asynchronous, so naive host timing often measures submission rather than completion. Median and percentile behavior across repeated trials are more useful than a single minimum. Benchmarks should match the scope of the optimization claim.

## Procedure
1. Define exactly what time interval the benchmark intends to measure.
2. Separate compile/JIT/setup cost from steady-state cost unless startup latency is the target.
3. Warm the device, code path, memory allocator, and caches consistently.
4. Use device events for kernel timing where appropriate and synchronized wall time for end-to-end timing.
5. Run enough repetitions to estimate variance.
6. Record median plus useful spread such as p5/p95 or confidence intervals.
7. Randomize or alternate A/B order to reduce drift bias.
8. Validate outputs during benchmarking.
9. Repeat across representative shapes and at least one cold-start scenario when relevant.
10. Save environment metadata with results.

## Decision points
Use microbenchmarks for kernel-local causality and end-to-end benchmarks for product claims. Report cold and warm paths separately when both matter. Treat differences smaller than environmental variance as inconclusive.

## Common failure patterns
Timing asynchronous launches with a host stopwatch; benchmarking only the fastest trial; ignoring warm-up; including setup in one implementation but not another; using unrealistic fixed inputs; failing to consume outputs.

## Verification
Confirm repeated runs produce stable distributions, timing boundaries match the claim, correctness checks pass, and an independent re-run reproduces the ranking.

## Expected output
A reproducible benchmark harness, documented timing scope, statistical results, and environment metadata.

## Stop conditions
Escalate when device sharing, thermal throttling, runtime instability, or inaccessible timing primitives make performance differences indistinguishable from noise.