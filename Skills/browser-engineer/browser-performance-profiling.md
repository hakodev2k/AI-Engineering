# Browser Performance Profiling

## Purpose
Investigate browser performance scientifically across CPU, latency, memory, IO, GPU, and process boundaries.

## When to use
Use for regressions, slow startup/navigation, jank, high CPU, memory pressure, or performance reviews.

## Inputs
Scenario, performance target, traces, profiles, benchmark data, hardware/software environment.

## Context to inspect
Critical path, task queues, IPC, network, rendering, JavaScript, storage, GPU, startup phases.

## Core knowledge
Performance must be measured on representative workloads. Averages hide tail latency. Profiling overhead and warm caches can distort results. Browser regressions frequently move cost between processes rather than remove it.

## Procedure
1. Define the metric and user scenario.
2. Stabilize environment and collect repeated baseline samples.
3. Capture trace and statistical profile.
4. Attribute wall time, CPU, queueing, IO, and IPC separately.
5. Form one bottleneck hypothesis at a time.
6. Change the smallest relevant factor.
7. Re-measure with identical methodology.
8. Check secondary metrics and low-end hardware implications.
9. Add a benchmark or regression guard where practical.

## Decision points
Optimize critical-path latency before background throughput for interactive scenarios. Trade memory for speed only with bounded, measured benefit.

## Common failure patterns
Single-run conclusions; optimizing debug builds; shifting work off measured thread; ignoring p95/p99; benchmarking unrealistic pages.

## Verification
Statistically credible before/after results show improvement without unacceptable regressions in memory, power, correctness, or security.

## Expected output
A measured diagnosis and validated optimization.

## Stop conditions
Stop if the benchmark is unstable, the regression cannot be reproduced, or required production-like hardware is unavailable.