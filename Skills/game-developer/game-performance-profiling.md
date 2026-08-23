# Game Performance Profiling

## Purpose
Find and fix CPU, GPU, memory, I/O, and frame-pacing bottlenecks using evidence rather than speculative optimization.

## When to use
Use for low FPS, stutter, long frames, thermal throttling, slow loading, memory pressure, or before committing to optimization work.

## Inputs
Performance targets, representative builds, profiler captures, hardware matrix, telemetry, scenes, and reproduction steps.

## Context to inspect
Inspect CPU main/render threads, GPU timings, draw calls, allocations/GC, asset streaming, physics, scripts, jobs, shaders, and platform diagnostics.

## Core knowledge
Optimize the limiting resource. Average FPS hides spikes; inspect percentiles and frame-time distributions. Editor/development overhead can distort measurements. CPU and GPU bottlenecks require different interventions.

## Procedure
1. Define measurable budgets per target platform.
2. Reproduce in a representative build and workload.
3. Determine CPU-bound, GPU-bound, memory-bound, or I/O-bound behavior.
4. Capture traces around bad frames.
5. Rank hotspots by total user impact.
6. Form one optimization hypothesis at a time.
7. Change the smallest relevant scope.
8. Re-measure against the same workload.
9. Check quality and correctness regressions.
10. Record before/after evidence.

## Decision points
Optimize algorithms and work frequency before micro-optimizing instructions. Reduce GPU overdraw/shader cost when GPU-bound; reduce scripting, synchronization, allocations, or simulation work when CPU-bound.

## Common failure patterns
Optimizing editor numbers, relying on averages, changing multiple variables at once, assuming draw calls are always the problem, premature pooling, and measuring different scenes before/after.

## Verification
Use comparable captures on target hardware, confirm budget improvement and no new bottleneck, and run regression scenarios.

## Expected output
A measured bottleneck diagnosis and verified performance improvement with reproducible evidence.

## Stop conditions
Stop when reproduction is unstable, target budgets are undefined, or profiling tools cannot observe the suspected subsystem.