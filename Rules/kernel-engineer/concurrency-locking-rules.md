# Concurrency and Locking Rules

## Purpose
Prevent races, deadlocks, priority inversion, atomicity violations, and unsafe concurrent state transitions.

## Scope
Locks, atomics, lock-free structures, per-CPU state, interrupt interaction, and shared kernel data.

## MUST
- Shared mutable state MUST have a documented synchronization strategy.
- Lock ordering MUST be explicit wherever multiple locks can be held together.
- Atomic operations MUST use ordering semantics sufficient for the invariant being protected.
- Sleepability and interrupt constraints MUST be respected while locks are held.
- Lifetime synchronization MUST prevent objects from being reclaimed while concurrently reachable.
- New lock-free algorithms MUST document progress guarantees and memory-order reasoning.

## MUST NOT
- MUST NOT sleep while holding a lock that forbids sleeping.
- MUST NOT call unknown or re-entrant code under a lock without analyzing lock-order implications.
- MUST NOT use atomics as a substitute for a coherent synchronization design.
- MUST NOT suppress race or lock diagnostics without evidence that the report is invalid.

## SHOULD
- Critical sections SHOULD be minimal and bounded.
- Prefer established kernel synchronization primitives over custom mechanisms.
- Contention-sensitive changes SHOULD be benchmarked under representative parallel load.

## Exceptions
Exceptions require invariant-level reasoning, concurrency evidence, alternatives considered, and maintainer approval.

## Verification
Use race detectors, lock validators, stress tests, fault injection, concurrency-focused code review, model checking where practical, and performance measurements for contention-sensitive paths.