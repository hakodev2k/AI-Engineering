# Real-Time Control and Scheduling

## Purpose
Design control paths that meet deterministic timing requirements and remain stable under realistic CPU, memory, and I/O contention.

## When to use
Use for servo loops, high-rate estimators, time-sensitive device handling, missed-deadline investigation, or real-time Linux configuration.

## Inputs
- Loop rates and deadlines
- Control stability requirements
- CPU topology
- OS/runtime configuration
- Worst-case workload
- I/O and middleware dependencies

## Preconditions
Required deadlines and acceptable jitter must be explicit; average latency is not a sufficient requirement.

## Context to inspect
Inspect thread priorities, executor scheduling, CPU affinity, memory allocation, locking, logging, page faults, interrupt handling, device I/O, and middleware behavior.

## Core knowledge
Understand deadlines, jitter, priority inversion, lock contention, preemption, CPU isolation, memory locking, allocation behavior, bounded queues, watchdogs, and worst-case versus average execution time.

## Procedure
1. Identify all deadline-sensitive loops.
2. Measure execution-time and jitter distributions before tuning.
3. Remove blocking I/O and unbounded work from critical threads.
4. Eliminate or bound dynamic allocation where necessary.
5. Review locks and shared resources for priority inversion.
6. Assign thread priorities and CPU affinity deliberately.
7. Separate control and noncritical telemetry workloads.
8. Configure watchdogs for missed deadlines.
9. Stress CPU, network, storage, and middleware concurrently.
10. Measure worst observed latency and missed deadlines.
11. Validate control stability under the stressed timing profile.

## Decision points
Use real-time OS/kernel features only when deadlines require them. Prefer architectural isolation before micro-optimizing code. Shared memory may reduce latency but increases coupling and synchronization risk.

## Common failure patterns
- Optimizing mean loop time while ignoring tail jitter
- Logging from real-time threads
- Unbounded queues
- Hidden allocator or lock activity
- High-priority thread starving safety/driver work
- Real-time tuning without load testing

## Verification
Measure deadline misses, maximum and percentile jitter, CPU utilization, lock wait, page faults, and closed-loop stability under worst credible contention.

## Expected output
A documented scheduling model with timing budgets, measured worst-case behavior, watchdogs, and resource isolation.

## Stop conditions
Stop if the platform cannot meet deadlines with reasonable isolation, a required dependency has unbounded blocking behavior, or changes would compromise system safety or OS supportability.