# WCET and Latency Analysis

## Purpose
Estimate and validate worst-case execution time and end-to-end latency so deadline claims are based on bounded evidence, not averages.

## When to use
Use for critical paths, control loops, ISR-to-task chains, deadline regressions, and hardware/platform changes.

## Inputs
Code path, compiler settings, target hardware, cache behavior, task graph, measurements, interrupt load, I/O timing.

## Context to inspect
Generated code, branch structure, loops, memory access, caches, DVFS, scheduler activity, contention, and instrumentation overhead.

## Core knowledge
WCET can be obtained through static analysis, measurement-based analysis, or hybrid methods. Measurements prove observed behavior, not absolute bounds, unless workload and platform assumptions justify the claim.

## Procedure
1. Define the path and deadline being analyzed.
2. Identify all contributing stages and preemption points.
3. Bound loop counts, recursion, blocking, and I/O waits.
4. Inspect compiler and hardware effects.
5. Establish representative and adversarial workloads.
6. Measure high-percentile and maximum observed latency.
7. Apply static or hybrid analysis where assurance demands it.
8. Include interference from interrupts, caches, buses, and other cores.
9. Add justified safety margin.
10. Record assumptions and revalidation triggers.

## Decision points
Use static WCET techniques for high-assurance bounded code; measurement-based approaches are appropriate when hardware complexity makes safe static bounds impractical and the assurance case permits empirical evidence.

## Common failure patterns
Treating p99 as worst case, testing only warm caches, ignoring frequency scaling, hiding I/O waits inside execution time, and adding arbitrary margin without analysis.

## Verification
Reproduce the analysis on target hardware and verify the complete end-to-end chain remains below its allocated deadline under stress.

## Expected output
Latency decomposition, WCET evidence, assumptions, margin, and revalidation criteria.

## Stop conditions
Stop when target hardware, compiler configuration, or critical path cannot be pinned down sufficiently to support a timing claim.