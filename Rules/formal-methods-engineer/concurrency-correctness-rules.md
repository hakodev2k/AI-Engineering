# Concurrency Correctness Rules

## Purpose
Verify that concurrent behavior preserves safety and progress under realistic interleavings.

## Scope
Applies to threads, actors, tasks, locks, lock-free algorithms, shared memory, message passing, and concurrent protocols.

## MUST
- Model relevant interleavings, atomicity boundaries, synchronization, and memory-order assumptions explicitly.
- Verify absence or controlled handling of races, deadlocks, livelocks, starvation, and lost updates where applicable.
- State linearization points or equivalent correctness criteria for concurrent objects that claim linearizable behavior.
- Include cancellation, retries, partial failure, and reentrancy when they can alter concurrency semantics.
- Validate memory-model assumptions against the target language/runtime/platform.

## MUST NOT
- Infer concurrency correctness from single-threaded tests or nominal traces.
- Treat operations as atomic unless guaranteed by the implementation model.
- Add fairness assumptions without evidence that the scheduler or protocol can satisfy them.

## SHOULD
- Reduce models using symmetry or partial-order techniques only when preservation conditions are understood.
- Use small-instance exhaustive exploration to expose ordering defects early.

## Exceptions
Deliberately weaker progress guarantees require documented user impact, operational mitigation, and reviewer approval.

## Verification
Use model checking, happens-before analysis, linearizability checks, stress testing, race detectors, counterexample traces, and architecture review.