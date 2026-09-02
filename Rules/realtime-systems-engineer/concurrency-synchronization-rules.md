# Concurrency and Synchronization Rules

## Purpose
Prevent unbounded blocking, races, deadlocks, and priority inversion in real-time workloads.

## Scope
Threads, tasks, locks, atomics, queues, shared memory, and synchronization protocols.

## MUST
- Shared mutable state MUST have an explicit synchronization strategy and ownership model.
- Blocking times on deadline-sensitive paths MUST be bounded and included in schedulability analysis.
- Priority inversion risks MUST be mitigated with an appropriate protocol or architecture.
- Lock ordering or equivalent deadlock prevention MUST be documented for multi-lock paths.

## MUST NOT
- MUST NOT introduce unbounded waits into hard real-time execution paths.
- MUST NOT use synchronization primitives whose worst-case behavior is unknown on critical paths.

## SHOULD
- Prefer message passing or bounded ownership transfer when it reduces shared-state contention.

## Exceptions
Exceptions require measured blocking evidence, bounded failure behavior, and technical approval.

## Verification
Use static analysis, race detection where applicable, architecture review, stress tests, scheduler traces, and bounded-blocking measurements.