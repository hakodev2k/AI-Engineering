# GPU Profiling and Bottleneck Attribution

## Purpose
Use profiler evidence to identify the dominant performance limiter of a GPU workload and distinguish kernel, launch, memory, synchronization, transfer, and host-side causes.

## When to use
Use for unexplained regressions, slow kernels, low throughput, poor scaling, or when optimization proposals are based on intuition rather than measurements.

## Inputs
Reproducible benchmark, representative inputs, profiler timeline, per-kernel counters, device specifications, compiler flags, runtime configuration, host traces.

## Preconditions
Correctness must be established first. Profiling should run in a stable environment with clocks, power policy, and competing workloads understood where possible.

## Context to inspect
Inspect kernel durations, launch frequency, occupancy, issue activity, stall reasons, memory throughput, cache hit rates, instruction mix, synchronization, host-device transfers, stream overlap, and CPU launch gaps.

## Core knowledge
A single counter rarely proves root cause. Performance attribution requires correlating timeline evidence with architectural limits and controlled experiments. Optimize the dominant limiter, not the most visible metric.

## Procedure
1. Define the user-visible or throughput metric that matters.
2. Capture an end-to-end timeline before collecting expensive detailed counters.
3. Rank kernels and non-kernel phases by contribution to total time.
4. Select the highest-impact region and gather focused metrics.
5. Compare achieved compute, memory, and issue rates against realistic ceilings.
6. Inspect stall reasons and validate them against code structure.
7. Form one bottleneck hypothesis at a time.
8. Design a minimal experiment that should change the suspected limiter.
9. Re-profile and determine whether the expected metric moved.
10. Repeat until remaining opportunities are below the required performance target or cost-benefit threshold.

## Decision points
Use timeline profiling first for orchestration problems; use instruction-level or source-correlated analysis for hot kernels. Prefer controlled A/B experiments over conclusions from one counter snapshot. Treat low occupancy as a symptom unless evidence shows latency hiding is insufficient.

## Common failure patterns
Profiling debug builds; collecting every counter and perturbing execution; optimizing tiny kernels while transfers dominate; reading peak bandwidth as an attainable universal target; conflating correlation with causation; ignoring warm-up effects.

## Verification
Reproduce the original workload, show before/after end-to-end timing, confirm the targeted bottleneck metric changed as predicted, and check that no new limiter or correctness regression was introduced.

## Expected output
A ranked bottleneck analysis with profiler evidence, tested hypotheses, and a prioritized optimization plan.

## Stop conditions
Escalate when profiling permissions are unavailable, instrumentation changes behavior materially, vendor tooling cannot observe the suspected layer, or workload variance prevents statistically meaningful attribution.