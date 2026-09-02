# Real-Time Scheduling

## Purpose
Integrate AI inference into deadline-sensitive edge systems without allowing model execution, memory allocation, or background work to destabilize higher-priority real-time behavior.

## When to use
Use in robotics, industrial control, automotive, audio, vision, or other systems where inference participates in a time-bounded control or decision loop.

## Inputs
Task deadlines, periods, worst-case execution times, OS/runtime scheduling model, CPU affinity, accelerator behavior, interrupt load, and criticality classification.

## Preconditions
Identify which deadlines are hard, firm, or soft and which tasks are safety-critical.

## Context to inspect
Thread priorities, CPU cores, interrupts, accelerator queues, synchronization, memory allocation, page faults, logging, watchdogs, and blocking I/O.

## Core knowledge
Average inference latency is insufficient for real-time design. Priority inversion, jitter, page faults, allocator stalls, thermal throttling, and non-preemptible accelerator work can violate deadlines. AI workloads should be isolated from higher-criticality loops where possible.

## Procedure
1. Map periodic, sporadic, and background tasks with deadlines and priorities.
2. Measure execution-time distributions and identify non-preemptible regions.
3. Reserve headroom using worst-case or defensible high-percentile bounds appropriate to system criticality.
4. Pin or isolate tasks when contention makes timing unstable.
5. Preallocate hot-path memory and warm runtimes where practical.
6. Bound accelerator queues and inference concurrency.
7. Eliminate blocking I/O and synchronous telemetry from deadline-critical paths.
8. Define deadline-miss behavior: skip, use last-valid result, degrade model, or enter safe state.
9. Test priority inversion and resource contention.
10. Validate under sustained thermal and maximum interrupt/background load.
11. Monitor deadline misses in production.

## Decision points
Run inference in a lower-criticality partition when deterministic execution cannot be guaranteed. Prefer dropping work over accumulating stale work in deadline-sensitive systems. Use smaller models when tail latency is more important than peak accuracy.

## Common failure patterns
Scheduling from average latency, unbounded queues, runtime compilation on hot paths, hidden locks, dynamic allocation spikes, and letting inference starve control tasks.

## Verification
Stress the full device, measure deadline-miss rate and jitter, inject overload, and confirm defined degradation or safe-state behavior.

## Expected output
A bounded scheduling design with priorities, budgets, overload policy, and timing evidence.

## Stop conditions
Stop when required hard deadlines cannot be bounded with the selected runtime/hardware or when inference can interfere with higher-criticality safety tasks.