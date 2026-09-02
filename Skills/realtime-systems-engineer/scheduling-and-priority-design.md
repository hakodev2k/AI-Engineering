# Scheduling and Priority Design

## Purpose
Design task scheduling so deadlines remain feasible under realistic load, blocking, and preemption. This skill converts workload models into an explicit scheduling policy rather than relying on incidental thread behavior.

## When to use
Use when creating or reviewing periodic tasks, control loops, real-time workers, interrupt-driven processing, or mixed-criticality workloads.

## Inputs
Task periods, deadlines, execution budgets, dependencies, blocking times, priorities, CPU topology, scheduler capabilities.

## Context to inspect
Thread creation, affinity, scheduler class, priority ranges, shared resources, interrupt priorities, background work, and operating-system defaults.

## Core knowledge
Rate-monotonic, deadline-monotonic, fixed-priority, and earliest-deadline-first policies have different assumptions and failure modes. Utilization alone is not enough when blocking, jitter, multicore interference, or non-preemptive sections exist.

## Procedure
1. Inventory schedulable entities and release patterns.
2. Record execution budgets and blocking sections.
3. Choose a scheduling model supported by the platform.
4. Assign priorities from deadline/period and criticality evidence.
5. Account for interrupt and kernel execution.
6. Run response-time or schedulability analysis.
7. Define CPU affinity only when it improves predictability.
8. Test overload and deadline-miss behavior.
9. Document priority rationale and forbidden changes.

## Decision points
Use fixed priority when analyzability and platform support dominate; consider EDF when dynamic deadline ordering provides clear utilization benefits and implementation support is mature.

## Common failure patterns
Priority by developer intuition, excessive highest-priority work, unbounded critical sections, ignoring kernel threads, and assuming multicore automatically improves predictability.

## Verification
Demonstrate schedulability analytically where possible and validate with worst-case workload traces on target hardware.

## Expected output
A documented task/priority map, scheduling policy, analysis results, and overload behavior.

## Stop conditions
Stop when execution budgets or blocking bounds cannot be established well enough to make the scheduling claim credible.