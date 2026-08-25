# Concurrency and Synchronization Analysis

## Purpose
Recover thread interactions, synchronization protocols, ownership, and race-prone state from compiled software.

## When to use
Use for deadlocks, races, intermittent crashes, worker pools, lock-free structures, callbacks, or asynchronous runtimes.

## Inputs
Binary, thread dumps/traces, synchronization API calls, crash evidence, representative workloads.

## Preconditions
Account for debugger and tracing effects on timing.

## Context to inspect
Thread creation, queues, locks, atomics, fences, condition variables, events, callbacks, shared globals, TLS, reference counts, and shutdown paths.

## Core knowledge
Concurrency semantics depend on memory ordering, not just instruction order. Compiler and CPU reordering, atomics, lock elision, and runtime scheduling complicate static reasoning.

## Procedure
1. Identify thread/task creation and execution entry points.
2. Map shared state and its readers/writers.
3. Catalog synchronization primitives and ownership rules.
4. Build lock-order and wait-for relationships.
5. Inspect atomic operations and memory-order implications.
6. Trace queue handoffs and lifecycle transitions.
7. Analyze startup, cancellation, error, and shutdown paths.
8. Reproduce suspicious interleavings with targeted tracing or stress tests.
9. Distinguish proven races/deadlocks from timing hypotheses.

## Decision points
Use static analysis for ownership and lock topology; dynamic tracing for actual interleavings; stress/sanitizer tooling when source-compatible reproductions exist.

## Common failure patterns
Assuming single-threaded callbacks; ignoring memory barriers; missing reference-count races; blaming the thread that crashes rather than the thread that corrupted state; debugger masking races.

## Verification
A concurrency finding should identify shared state, conflicting operations, missing/incorrect ordering, and a feasible interleaving. Reproduction or trace evidence strengthens verification.

## Expected output
Thread model, synchronization map, risky interleavings, and evidence-backed root-cause hypotheses.

## Stop conditions
Stop production experimentation when timing manipulation risks availability or data integrity; reproduce in a controlled environment instead.