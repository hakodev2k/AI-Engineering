# GPU Profiling and Bottleneck Analysis

## Purpose
Diagnose GPU kernel performance systematically using profiler evidence, roofline-style reasoning, and controlled experiments.

## When to use
Use for slow kernels, regressions, architecture migrations, suspected stalls, or optimization planning.

## Inputs
Representative benchmark, kernel source, profiler traces, compiler reports, target GPU specifications, and baseline runtime.

## Context to inspect
Kernel timeline, achieved occupancy, instruction throughput, memory bandwidth, cache hit rates, stall reasons, launch overhead, copy/compute overlap, and CPU synchronization.

## Core knowledge
Optimization begins by identifying the limiting resource. A kernel may be compute-, bandwidth-, latency-, synchronization-, launch-, or resource-bound, and bottlenecks can shift after each change. Single counters rarely prove causality.

## Procedure
1. Build a stable benchmark with warm-up and repeatable inputs.
2. Measure end-to-end and per-kernel latency before collecting detailed counters.
3. Identify dominant kernels and timeline gaps.
4. Compare achieved bandwidth and compute throughput against realistic ceilings.
5. Inspect occupancy, active lanes, cache behavior, stalls, and instruction mix.
6. Form one bottleneck hypothesis at a time.
7. Design a minimal experiment that should change the predicted limiting factor.
8. Re-profile and reject hypotheses unsupported by evidence.
9. Track bottleneck migration after improvements.
10. Record hardware, driver, compiler, clocks, and benchmark conditions.

## Decision points
Prioritize optimizations by end-to-end impact, not by interesting counters. Use microbenchmarks to isolate causes, then validate in the real workload.

## Common failure patterns
Optimizing the wrong kernel; interpreting one profiler metric in isolation; comparing runs with different clocks or inputs; ignoring launch/host overhead; and declaring success from synthetic benchmarks only.

## Verification
Require statistically stable latency improvement plus profiler evidence explaining why the improvement occurred.

## Expected output
A bottleneck diagnosis, evidence chain, prioritized experiments, and before/after measurements.

## Stop conditions
Stop when measurements are unstable, representative workloads are unavailable, or profiling access is insufficient to support the claimed diagnosis.