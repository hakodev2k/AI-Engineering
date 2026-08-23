# Real-Time Timing Analysis

## Purpose
Prove that firmware meets latency, deadline, throughput, and jitter requirements under realistic worst-case conditions.

## When to use
Use for control loops, communications, sampling, motor control, audio, safety functions, deadline misses, or scheduling changes.

## Inputs
Timing requirements, task/ISR design, clock rates, traces, peripheral timing, workload bounds, and scheduling policy.

## Context to inspect
Inspect execution paths, blocking, preemption, interrupt masking, bus/DMA contention, clock changes, caches, and periodic/aperiodic workloads.

## Core knowledge
Average timing is insufficient for real-time correctness. Analyze worst-case response time, interference, blocking, release jitter, and overload behavior. Measurement complements analysis but may not cover every path.

## Procedure
1. Define deadlines and tolerated jitter for each critical activity.
2. Identify release sources and maximum rates.
3. Measure or bound execution time.
4. Account for higher-priority interference and blocking.
5. Include ISR, DMA, bus, and critical-section effects.
6. Test synchronized worst-case workloads.
7. Record margin rather than pass/fail only.
8. Define overload/degradation behavior.
9. Re-run analysis after scheduler, clock, or feature changes.

## Decision points
Optimize only paths that threaten timing margin. Increase priority only when it improves schedulability without starving other deadlines. Hardware offload/DMA may reduce CPU load but can add contention and complexity.

## Common failure patterns
Using averages, testing one subsystem at a time, ignoring jitter, measuring debug builds, assuming faster CPU fixes blocking, and failing to define overload limits.

## Verification
Collect timing distributions and worst observed values, compare with analytical bounds, stress simultaneous peak events, and confirm margin against requirements.

## Expected output
A timing budget with measured/bounded execution, response times, jitter, margins, and overload policy.

## Stop conditions
Stop when deadlines or maximum event rates are unspecified, or when instrumentation materially changes the timing without an alternate method.