# Profiling and Jitter Investigation

## Purpose
Diagnose latency spikes and execution-time variance using evidence that preserves the timing characteristics being measured.

## When to use
Use for missed deadlines, unexplained p99/max latency, periodic jitter, CPU spikes, cache effects, or regressions after code/platform changes.

## Inputs
Timing traces, profiler data, scheduler events, hardware counters, code changes, workload, target hardware.

## Context to inspect
Task switches, interrupts, locks, CPU affinity, frequency scaling, caches, page faults, memory allocation, I/O, thermal behavior, and telemetry overhead.

## Core knowledge
Jitter is usually caused by interference, blocking, variable execution paths, hardware state, or observation overhead. Correlation is not causation; timeline reconstruction across scheduler, interrupts, and application events is essential.

## Procedure
1. Define the exact latency interval and failure threshold.
2. Reproduce with a controlled workload on target hardware.
3. Establish baseline distribution and maximum observed value.
4. Add low-overhead scheduler/interrupt/application tracepoints.
5. Correlate spikes with preemption, blocking, faults, I/O, GC/allocation, or hardware events.
6. Form one falsifiable hypothesis at a time.
7. Change one variable and repeat measurements.
8. Verify improvements across warm/cold, burst, and long-duration scenarios.
9. Record root cause and regression guard.

## Decision points
Use sampling profilers for CPU hotspots; use tracing for chronology and blocking; use hardware counters for cache, branch, memory, or pipeline interference.

## Common failure patterns
Profiling only average cases, heavy instrumentation that hides the issue, optimizing the hottest function when the problem is blocking, and testing on non-representative hardware.

## Verification
Reproduce the original failure, apply the change, and demonstrate that the deadline margin improves under the same and adversarial workloads.

## Expected output
A root-cause report, evidence timeline, measured fix, and regression test or performance gate.

## Stop conditions
Stop when reproduction requires unsafe production manipulation or available instrumentation changes the system enough to invalidate conclusions.