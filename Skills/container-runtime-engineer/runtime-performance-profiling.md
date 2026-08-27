# Runtime Performance Profiling

## Purpose
Measure and optimize container runtime startup, exec, teardown, CPU, memory, IO, and syscall overhead without sacrificing correctness.

## When to use
Use for slow container startup, high daemon CPU, memory growth, fleet-density issues, or performance regressions.

## Inputs
Latency distributions, profiles, traces, host metrics, workload mix, runtime configuration, baseline version.

## Context to inspect
Break lifecycle latency into API, snapshot/mount, namespace/cgroup, security policy, process creation, plugin, and synchronization phases.

## Core knowledge
Runtime performance is dominated by tail latency and host contention at scale. Microbenchmarks can hide filesystem, lock, process, and plugin costs. Optimization must preserve isolation and cleanup invariants.

## Procedure
1. Define workload and percentile SLOs.
2. Establish reproducible baseline with warm/cold cases.
3. Instrument lifecycle phases.
4. Profile CPU, allocations, syscalls, IO, locks, and scheduler delays.
5. Identify the dominant bottleneck by evidence.
6. Form one optimization hypothesis.
7. Implement the smallest change.
8. Benchmark under concurrency and realistic host pressure.
9. Check security/correctness regressions.
10. Compare p50/p95/p99 and resource consumption.

## Decision points
Cache only stable, safely reusable state. Prefer reducing work and contention before adding concurrency, which can amplify host pressure.

## Common failure patterns
Optimizing averages, benchmark noise, disabling security controls for speed, unbounded caches, lock sharding without contention evidence, and ignoring teardown costs.

## Verification
Require statistically credible before/after results, unchanged lifecycle tests, and no resource leak increase.

## Expected output
A measured performance improvement or bottleneck report with reproducible evidence.

## Stop conditions
Stop when measurement variance exceeds expected gain or optimization changes security/correctness semantics without review.