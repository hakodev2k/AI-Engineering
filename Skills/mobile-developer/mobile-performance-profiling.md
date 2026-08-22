# Mobile Performance Profiling

## Purpose
Diagnose and improve startup, rendering, CPU, memory, I/O, and network performance using evidence.

## When to use
Slow startup, jank, battery drain, memory pressure, latency regressions.

## Inputs
Reproduction steps, devices, builds, traces, metrics.

## Context to inspect
Startup path, main thread, rendering, allocations, disk/network I/O, image pipeline, background work.

## Core knowledge
Optimize measured bottlenecks on representative devices. Tail latency and frame consistency often matter more than averages.

## Procedure
1. Define a user-visible metric and baseline.
2. Reproduce on release-like builds/devices.
3. Capture profiler/system traces.
4. Attribute time/resources to concrete work.
5. Form one hypothesis at a time.
6. Change the highest-impact bottleneck.
7. Re-measure under identical conditions.
8. Check memory, battery, correctness trade-offs.
9. Add regression thresholds where practical.

## Decision points
Prefer removing work over micro-optimizing it; defer noncritical startup work when UX permits.

## Common failure patterns
Profiling debug builds, optimizing averages only, guessing, shifting work to another bottleneck.

## Verification
Before/after traces and representative benchmark distributions.

## Expected output
Measured root cause, improvement evidence, regression guard.

## Stop conditions
Stop when instrumentation is unreliable or improvement harms correctness/security.