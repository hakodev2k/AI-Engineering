# Firmware Performance Profiling

## Purpose
Find and remove firmware bottlenecks using measured CPU, latency, throughput and memory evidence.

## When to use
Use for missed deadlines, excessive CPU load, throughput limits, memory pressure or optimization review.

## Inputs
Performance target, workload, build configuration, timing traces and resource metrics.

## Context to inspect
Hot paths, interrupt load, task scheduling, copies, allocation, compiler optimization and I/O waits.

## Core knowledge
Optimize the limiting resource, not intuition. Worst-case latency can matter more than averages in real-time systems.

## Procedure
1. Define metric and acceptance threshold.
2. Reproduce representative workload.
3. Capture baseline.
4. Localize dominant contributors.
5. Separate CPU, wait, scheduling and I/O causes.
6. Change one material factor at a time.
7. Re-measure average and worst case.
8. Check flash/RAM/power trade-offs.
9. Add regression thresholds where stable.

## Decision points
Prefer algorithmic or architectural gains before micro-optimization; use lower-level optimization only when profiling proves value.

## Common failure patterns
Optimizing debug builds, relying on averages, trading correctness for speed, benchmarking unrealistic workloads and ignoring increased memory or power.

## Verification
Compare controlled before/after measurements and verify functional regressions did not occur.

## Expected output
Measured bottleneck analysis and justified optimization.

## Stop conditions
Stop when measurement fidelity is insufficient to distinguish competing causes.