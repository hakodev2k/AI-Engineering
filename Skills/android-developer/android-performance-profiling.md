# Android Performance Profiling

## Purpose
Diagnose and improve Android startup, rendering, CPU, memory, I/O, and battery performance using measured evidence instead of guesswork.

## When to use
Use for slow startup, jank, ANRs, high CPU, battery drain, memory pressure, or performance regressions.

## Inputs
User-visible symptoms, device/OS matrix, traces, benchmark results, release build configuration, workload definition.

## Preconditions
Reproduce on representative hardware and measure a release-like build.

## Context to inspect
Startup path, main-thread work, Compose/View rendering, coroutines, database/network I/O, allocations, GC, background jobs, and dependency initialization.

## Core knowledge
Performance is workload- and device-dependent. Debug builds distort results. Optimize measured bottlenecks, preserve correctness, and distinguish cold/warm/hot paths.

## Procedure
1. Define a user-centered metric and regression threshold.
2. Reproduce under controlled conditions.
3. Capture system/app traces and benchmark baselines.
4. Attribute time to CPU, I/O, locking, rendering, allocation, or scheduling.
5. Identify the smallest dominant bottleneck.
6. Remove unnecessary work before micro-optimizing.
7. Move deferrable work off critical paths without violating lifecycle correctness.
8. Re-measure on multiple representative devices.
9. Add macro/micro benchmarks for regression protection where valuable.
10. Record trade-offs in memory, complexity, freshness, or battery.

## Decision points
Cache only when invalidation and memory cost are acceptable. Parallelize only independent work and verify contention does not offset gains.

## Common failure patterns
Profiling debug builds, optimizing averages while ignoring tails, moving work off Main but still blocking shared pools, premature caching, and declaring improvement without baseline comparison.

## Verification
Compare before/after traces and benchmark distributions on the same workload. Verify functional tests and resource use remain acceptable.

## Expected output
Measured bottleneck, implemented change, before/after evidence, and regression guard where appropriate.

## Stop conditions
Escalate when bottleneck lies in platform/vendor code, requires architectural change, or performance targets conflict with correctness or battery constraints.