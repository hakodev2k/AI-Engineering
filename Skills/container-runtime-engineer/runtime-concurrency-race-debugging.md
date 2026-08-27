# Runtime Concurrency and Race Debugging

## Purpose
Find and eliminate races in concurrent container lifecycle operations, event delivery, state persistence, and cleanup.

## When to use
Use for intermittent create/delete/exec/kill failures, deadlocks, duplicate events, or corruption under load.

## Inputs
Concurrent traces, logs with IDs/timestamps, goroutine/thread dumps, race-detector output, state machine, reproduction harness.

## Context to inspect
Inspect locks, atomic state, process identity, filesystem transactions, event queues, cancellation, and cross-process synchronization.

## Core knowledge
Runtime operations race with workload exit and external cancellation. Locks protect memory but not kernel/filesystem state across processes. Idempotent state transitions and stable identities reduce race impact.

## Procedure
1. Define the invariant that was violated.
2. Build a timeline of competing operations.
3. Identify shared state and synchronization scope.
4. Reproduce with stress, delays, and fault injection.
5. Use race detectors where language/runtime permits.
6. Check lock ordering and blocking calls under locks.
7. Replace check-then-act patterns with atomic/stable-handle operations.
8. Make terminal operations idempotent.
9. Add deterministic regression tests.
10. Run prolonged concurrency stress.

## Decision points
Use serialization when operations mutate one lifecycle state machine; use fine-grained concurrency only when independence is proven. Prefer kernel primitives like pidfds/openat-style handles over pathname/PID re-resolution.

## Common failure patterns
Double delete, lost wakeups, lock inversion, holding locks across plugin calls, PID reuse, stale reads, and cancellation leaving half-written state.

## Verification
Race tests, stress loops, deadlock monitoring, invariant assertions, and clean host state after all runs.

## Expected output
A race RCA and minimal synchronization/state-machine correction.

## Stop conditions
Stop if a fix relies on timing sleeps or cannot state the invariant it protects.