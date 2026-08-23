# Concurrency and Shared State

## Purpose
Prevent races, deadlocks, torn state, and timing-dependent defects across tasks, interrupts, DMA, and multicore execution.

## When to use
Use when state is accessed from multiple execution contexts or when investigating intermittent corruption and hangs.

## Inputs
Code paths, execution contexts, synchronization primitives, memory model/compiler details, traces, and failure evidence.

## Context to inspect
Map every reader/writer, ISR/task boundary, DMA ownership transition, lock order, atomic operation, volatile use, and cache/coherency requirement.

## Core knowledge
`volatile` does not generally provide atomicity or mutual exclusion. Correct synchronization depends on ownership, atomic operations, memory ordering, critical-section duration, and platform-specific cache/DMA coherence.

## Procedure
1. Inventory mutable shared objects.
2. Assign intended ownership and access contexts.
3. Identify compound operations requiring atomicity.
4. Choose message passing, critical sections, atomics, or locks deliberately.
5. Establish lock ordering when multiple locks exist.
6. Review ISR and DMA interactions separately.
7. Bound blocking and interrupt-disabled time.
8. Instrument contention and rare-state transitions.
9. Stress scheduling and high-rate I/O.

## Decision points
Prefer single-owner/message-passing designs over shared mutation. Use atomics for simple lock-free state only when memory-order semantics are understood. Use mutexes where blocking is legal and priority behavior is controlled.

## Common failure patterns
Using volatile as a lock, check-then-act races, inconsistent lock order, copying DMA buffers while owned by hardware, nested critical sections, and synchronization that works only in debug builds.

## Verification
Run concurrency stress tests, inspect race-sensitive invariants, measure critical sections, and reproduce across optimized builds and realistic interrupt rates.

## Expected output
An explicit ownership and synchronization model with bounded contention and verified invariants.

## Stop conditions
Stop when execution contexts, DMA/cache semantics, or required atomic guarantees cannot be established.