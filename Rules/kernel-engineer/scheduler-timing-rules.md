# Scheduler and Timing Rules

## Purpose
Preserve scheduling fairness, responsiveness, timing correctness, and bounded execution behavior.

## Scope
Scheduling classes, wakeups, timers, deadlines, CPU affinity, preemption, and timekeeping interactions.

## MUST
- Scheduler-facing changes MUST identify effects on fairness, latency, throughput, starvation, and CPU utilization.
- Time calculations MUST use clock sources and units appropriate to the semantic requirement.
- Timeout logic MUST handle wraparound, cancellation, races, and late delivery according to platform contracts.
- Priority or affinity changes MUST have a documented policy reason.
- Latency-critical changes MUST be validated under contention and representative CPU topology.

## MUST NOT
- MUST NOT assume wall-clock time is monotonic.
- MUST NOT create unbounded runnable work in a context that can starve other system activity.
- MUST NOT depend on exact timer delivery where the timer contract permits delay.
- MUST NOT alter scheduler policy merely to mask a blocking or contention defect.

## SHOULD
- Prefer monotonic clocks for elapsed-time measurement.
- Timer callbacks SHOULD do bounded work.
- Scheduling policy SHOULD remain mechanism-independent where practical.

## Exceptions
Exceptions require timing evidence, workload justification, system-wide impact analysis, and maintainer approval.

## Verification
Use scheduler tracing, latency histograms, CPU saturation tests, timer race tests, affinity/topology tests, and long-running stress workloads.