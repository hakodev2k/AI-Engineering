# Concurrency and Synchronization

## Purpose
Design concurrent real-time code with bounded blocking, explicit ownership, and predictable execution. The goal is not maximum parallelism; it is controlled timing behavior and correctness.

## When to use
Use for shared state, producer-consumer pipelines, multicore execution, interrupt-to-thread handoff, or contention-related jitter.

## Inputs
Task graph, shared resources, update rates, criticality, data ownership, synchronization primitives, timing budgets.

## Context to inspect
Locks, atomics, queues, critical sections, memory ordering, thread affinities, interrupt contexts, and blocking APIs.

## Core knowledge
Mutexes, semaphores, atomics, lock-free structures, RCU-like patterns, and message passing trade simplicity, blocking bounds, memory overhead, and proof burden differently. Lock-free does not mean wait-free or deterministic.

## Procedure
1. Map all shared mutable state and owners.
2. Prefer single-writer or message-passing designs where practical.
3. Bound critical-section duration.
4. Select synchronization with scheduler semantics in mind.
5. Define memory-ordering requirements explicitly.
6. Prevent blocking calls from high-criticality paths.
7. Analyze deadlock, livelock, starvation, and inversion risks.
8. Stress test under maximum contention and preemption.
9. Document ownership and synchronization invariants.

## Decision points
Prefer locks when contention is low and blocking is bounded; choose lock-free/wait-free techniques only when measured timing requirements justify their complexity.

## Common failure patterns
Nested locks without ordering, blocking inside ISRs, assuming atomics make compound operations atomic, unbounded queue growth, and cache-line contention on multicore systems.

## Verification
Use race detection where applicable, stress tests, timing traces, invariant checks, and bounded-blocking analysis on target hardware.

## Expected output
A concurrency design with ownership, primitive choices, blocking bounds, and verified failure behavior.

## Stop conditions
Stop if required platform memory-ordering guarantees or synchronization semantics are unclear enough to invalidate correctness or timing analysis.