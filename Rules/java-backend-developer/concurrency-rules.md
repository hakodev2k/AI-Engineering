# Concurrency Rules

## Purpose
Prevent races, deadlocks, thread starvation, and unsafe publication in concurrent Java backends.

## Scope
Applies to threads, executors, locks, atomics, concurrent collections, futures, virtual threads, and shared state.

## MUST
- Shared mutable state MUST have an explicit synchronization or confinement strategy.
- Executor ownership, queue bounds, rejection behavior, and shutdown semantics MUST be defined.
- Blocking operations MUST be isolated from execution resources whose starvation would stall unrelated work.
- Lock ordering and critical-section scope MUST be reviewable where multiple locks exist.
- Cancellation and interruption MUST be propagated or deliberately translated without losing semantics.

## MUST NOT
- MUST NOT use unbounded task queues where producer rate can exceed consumer capacity.
- MUST NOT swallow `InterruptedException` without restoring interruption or completing a deliberate cancellation policy.
- MUST NOT assume thread-safe containers make compound operations atomic.

## SHOULD
- Prefer immutable data, message passing, confinement, and higher-level concurrency primitives over manual locking.
- Use virtual threads only after validating downstream concurrency limits and pinning/blocking behavior relevant to the runtime.

## Exceptions
Any deliberate unbounded concurrency or unusual synchronization requires workload evidence, explicit limits elsewhere, failure analysis, and review approval.

## Verification
Use stress tests, race-oriented tests, thread dumps, executor metrics, load tests, static analysis, and code review. Validate behavior under cancellation, saturation, slow dependencies, and shutdown.