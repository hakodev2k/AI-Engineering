# Concurrency Rules

## Purpose
Prevent races, deadlocks, unsafe shared-memory behavior, and scheduler-dependent correctness failures.

## Scope
Applies to threads, shared linear memory, atomics, async host calls, workers, and concurrent instances.

## MUST
- Shared mutable state MUST have an explicit synchronization strategy.
- Atomic operations MUST document the invariant they protect and required ordering semantics.
- Cancellation and completion races at host boundaries MUST be handled explicitly.
- Concurrent resource limits MUST protect the host from instance or worker amplification.
- Concurrency-sensitive code MUST have stress or race-oriented tests appropriate to the runtime.

## MUST NOT
- Correctness MUST NOT depend on observed scheduler timing.
- Non-atomic shared-memory access MUST NOT race with concurrent writes.
- Locks or host callbacks MUST NOT create undocumented re-entrancy assumptions.
- Retrying an operation after a timeout MUST NOT duplicate non-idempotent side effects without protection.

## SHOULD
- Prefer message passing or isolated state where it materially reduces synchronization complexity.
- Keep critical sections small and avoid host calls while holding locks where possible.
- Document whether a module/instance is safe for concurrent invocation.

## Exceptions
Lock-free or deliberately racy algorithms require a written memory-model argument, tests, and senior review.

## Verification
Run stress tests, race detectors where available in host/native code, deterministic scheduling tests when practical, and manual review of atomics, locks, callbacks, and cancellation paths.