# Memory Leak and Lifecycle Debugging

## Purpose
Find retained objects, runaway allocations, and lifecycle ownership defects in iOS applications.

## When to use
Use for increasing memory, deinit failures, repeated-screen growth, jetsam risk, or retained controllers/models.

## Inputs
Reproduction steps, memory graphs/traces, expected object lifetimes, relevant code.

## Context to inspect
Closures, delegates, timers, notifications, Combine/async tasks, caches, controller hierarchies, image/data allocations.

## Core knowledge
ARC manages reference counts, not ownership intent. Cycles commonly arise through closures, delegates, tasks, timers, and long-lived registries. High memory without a leak may still cause termination.

## Procedure
1. Establish expected lifecycle for suspect objects.
2. Reproduce repeated allocation/release cycle.
3. Capture memory graph and allocation trace.
4. Identify retaining path or dominant allocation class.
5. Determine intended owner.
6. Break cycles with correct ownership, cancellation, or teardown rather than arbitrary weak references.
7. Bound caches/buffers where growth is legitimate but excessive.
8. Repeat the exact scenario.
9. Add regression tests or diagnostics where practical.

## Decision points
Use weak references only when the referenced object may validly disappear first. Use unowned only with a proven lifetime invariant.

## Common failure patterns
Weak-everything fixes, retained Tasks, observer leaks, timer cycles, image spikes, and judging only by deinit prints.

## Verification
Compare memory graphs and steady-state footprint over repeated navigation/workload cycles on device.

## Expected output
Documented retaining path or allocation cause, ownership fix, and measured post-fix footprint.

## Stop conditions
Stop when private framework allocations dominate and evidence cannot attribute them to application behavior.