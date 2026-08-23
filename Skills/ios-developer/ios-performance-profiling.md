# iOS Performance Profiling

## Purpose
Diagnose and improve startup, rendering, CPU, memory, I/O, networking, and energy performance using evidence rather than guesswork.

## When to use
Use for slow launch, hangs, scrolling jank, thermal/energy issues, regressions, or performance budgets.

## Inputs
Reproduction scenario, target devices/OS, baseline metrics, traces, release configuration.

## Context to inspect
Instruments traces, MetricKit/organizer data, signposts, main-thread work, allocations, network/I/O, image pipeline, build settings.

## Core knowledge
Optimize measured bottlenecks under representative release builds. Percentiles and device classes matter more than simulator anecdotes.

## Procedure
1. Define a user-visible metric and target.
2. Reproduce on representative hardware with release-like settings.
3. Capture baseline trace and telemetry.
4. Identify dominant CPU, wait, allocation, I/O, network, or GPU cost.
5. Trace cost to owning code/path.
6. Change one material cause at a time.
7. Re-measure the same scenario.
8. Check regressions in memory, energy, correctness, and maintainability.
9. Add durable metric/signpost where recurring.

## Decision points
Cache only when recomputation/I/O dominates and invalidation is safe. Parallelize only when dependencies and overhead justify it.

## Common failure patterns
Optimizing debug builds, simulator-only profiling, micro-optimizing non-bottlenecks, hiding work behind async without reducing cost, and unbounded caches.

## Verification
Compare before/after traces and production-relevant metrics across repeated runs and representative devices.

## Expected output
Measured root cause, quantified improvement, regression evidence, and residual bottlenecks.

## Stop conditions
Stop when no reproducible baseline exists or improvement requires product-quality trade-offs without approval.