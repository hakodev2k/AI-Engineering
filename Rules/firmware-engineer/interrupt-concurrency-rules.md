# Interrupt and Concurrency

## Purpose
Prevent races, deadlocks, priority failures, and nondeterministic corruption.

## Scope
ISRs, tasks, threads, DMA callbacks, shared memory, atomics, and synchronization.

## MUST
- Every shared object accessed concurrently MUST have an explicit synchronization or lock-free correctness strategy.
- ISR execution MUST be bounded and defer noncritical work where feasible.
- Data shared with interrupts or DMA MUST use memory visibility semantics appropriate to the architecture and compiler.
- Lock ordering MUST be defined when multiple locks can be acquired.
- Priority inversion risk MUST be evaluated for real-time paths.

## MUST NOT
- Blocking operations MUST NOT execute in interrupt context unless the platform explicitly guarantees safety and bounded behavior.
- volatile MUST NOT be treated as a substitute for atomicity or synchronization.
- Interrupts MUST NOT be disabled for unbounded or unnecessarily broad critical sections.

## SHOULD
- Message passing SHOULD replace shared mutable state where it simplifies correctness.

## Exceptions
Exceptions require timing evidence, concurrency analysis, and target-specific verification.

## Verification
Use static analysis, stress tests, race-oriented tests, interrupt latency measurements, and code review.