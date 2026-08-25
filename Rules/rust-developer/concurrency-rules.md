# Concurrency

## Purpose
Prevent races, deadlocks, starvation, and unbounded contention in concurrent Rust systems.

## Scope
Threads, atomics, channels, shared state, locks, and parallel execution.

## MUST
- Shared mutable state MUST have an explicit synchronization and ownership model.
- Lock ordering MUST be defined when multiple locks can be held concurrently.
- Atomic memory ordering weaker than sequential consistency MUST include a correctness rationale.
- Concurrent shutdown and cancellation behavior MUST be tested.

## MUST NOT
- MUST NOT hold blocking locks across operations with unbounded latency unless explicitly justified.
- MUST NOT use `unsafe impl Send` or `unsafe impl Sync` without proving the required invariants.
- MUST NOT rely on timing sleeps as synchronization in correctness-sensitive tests.

## SHOULD
- Prefer message passing or partitioned ownership where it materially reduces shared-state complexity.
- Minimize lock scope and measure contention before optimization.

## Exceptions
Nonstandard synchronization requires documented invariants, failure modes, and reviewer approval.

## Verification
Use stress tests, Loom or equivalent model checking where practical, profiling, deadlock analysis, and code review of synchronization boundaries.