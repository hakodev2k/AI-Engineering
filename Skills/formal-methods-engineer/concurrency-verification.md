# Concurrency Verification

## Purpose
Verify correctness under concurrent execution by making interleavings, synchronization, atomicity, and shared-state assumptions explicit.

## When to use
Use for multithreaded code, lock-free algorithms, concurrent state machines, distributed workers, shared databases, and race-sensitive protocols.

## Inputs
Concurrency model, shared state, synchronization primitives, transaction semantics, scheduling assumptions, and target properties.

## Preconditions
Identify which operations are atomic and what memory/consistency model applies.

## Context to inspect
Locks, atomics, queues, transactions, retry loops, cancellation, callbacks, reentrancy, and ownership boundaries.

## Core knowledge
Correctness depends on happens-before relations, atomicity boundaries, interference, linearization points, deadlock freedom, starvation, and memory ordering. Sequential tests cannot establish concurrent correctness.

## Procedure
1. Enumerate concurrent actors and shared resources.
2. Define atomic actions and synchronization semantics.
3. State data-race, deadlock, starvation, and consistency properties.
4. Model representative interleavings and failure timing.
5. Identify candidate linearization points where applicable.
6. Check lock ordering and wait dependencies.
7. Model cancellation, timeout, retry, and duplicate execution.
8. Use reduction techniques only when independence is justified.
9. Analyze counterexamples against the implementation design.
10. Add implementation-level stress or deterministic-scheduler tests for discovered risks.

## Decision points
Use linearizability for externally atomic operations; use weaker consistency models when the product semantics allow them. Prefer compositional verification when components have stable contracts.

## Common failure patterns
Assuming scheduler fairness, omitting reentrancy, treating database transactions as globally atomic, missing ABA-style state changes, and proving only a single interleaving.

## Verification
Model-check relevant schedules, reproduce known races, validate lock-order properties, and confirm negative mutations are detected.

## Expected output
Verified concurrency properties, identified linearization/atomicity boundaries, counterexamples, and residual risks.

## Stop conditions
Stop when the memory model or synchronization semantics are unknown, or the abstraction hides the interference being verified.