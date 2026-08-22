# Skill: Background Work Investigation

## Purpose
Find and bound background jobs that consume CPU, memory, I/O, or wall time while an agent surface is idle.

## Trigger
Idle CPU above target, UI stutter, unexplained memory growth, repeated background scans, or startup maintenance that blocks responsiveness.

## Inputs
Job registry, process samples, idle/active timeline, workload size, configured budgets.

## Preconditions
A reproducible idle window exists; foreground agent tasks are stopped; baseline duration is at least 60 seconds where practical.

## Required context
Expected maintenance jobs, ownership, scheduling intervals, safe cancellation semantics, user-visible correctness requirements.

## Allowed tools
OS process samplers, application telemetry, read-only logs, deterministic analyzer, profiler if approved.

## Constraints
Measure before optimizing. Do not disable security checks, integrity maintenance, or required synchronization merely to reduce CPU. Prefer defer/rate-limit/incremental work over dropping correctness work.

## Procedure
1. Capture a baseline idle window with process CPU time, RSS, I/O counters, and job start/finish events.
2. Normalize CPU as core-seconds per wall-minute rather than only total-system percent.
3. Attribute resource deltas to registered jobs where telemetry exists.
4. Identify recurring jobs, overlapping runs, unchanged-state rescans, and jobs that outlive their owner/idle policy.
5. Form one hypothesis per offender: polling interval, full rescan, missing watermark, overlap, retry loop, or visibility-state bug.
6. Apply one bounded change.
7. Repeat the same idle benchmark.
8. Accept only if target metrics improve and maintenance correctness tests still pass.

## Decision points
- Foreground task active: exclude from idle benchmark.
- Required job exceeds budget once: record and allow configured grace.
- Repeated breach: defer/cancel and enter recovery workflow.
- Correctness regression: reject optimization.

## Expected output
Baseline/post-change metrics, offender ranking, hypothesis, applied change, PASS/BLOCK.

## Metrics
Core-seconds/minute, RSS delta/minute, read/write bytes/minute, job duty cycle, overlap count, repeated unchanged scans, p95 job duration, breach count.

## Verification
Repeat at least three idle windows when feasible and run maintenance correctness tests.

## Failure handling
At most two optimization attempts per offender. Stop on unknown ownership/cancellation semantics.

## Stop conditions
No reproducible breach, correctness regression, unsafe cancellation, or two failed remediation attempts.