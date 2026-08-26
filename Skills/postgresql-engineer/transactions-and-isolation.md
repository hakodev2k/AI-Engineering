# Transactions and Isolation

## Purpose
Design transaction boundaries and isolation behavior that preserve invariants under concurrency without unnecessary contention.

## When to use
Use for multi-step writes, race conditions, financial/inventory workflows, or concurrency anomalies.

## Inputs
Business invariants, SQL sequence, concurrency model, acceptable retry behavior.

## Context to inspect
Current isolation level, locks, constraints, application transaction scope, connection pooling, and external side effects.

## Core knowledge
Understand MVCC, Read Committed, Repeatable Read, Serializable, snapshots, write conflicts, predicate anomalies, and transaction retry requirements.

## Procedure
1. State the invariant that must survive concurrency.
2. Minimize transaction scope.
3. Identify reads whose results influence writes.
4. Determine anomalies possible at current isolation.
5. Prefer constraints and atomic SQL where sufficient.
6. Select stronger isolation or explicit locking only when required.
7. Define bounded retry behavior for serialization/deadlock failures.
8. Keep external network calls outside transactions where possible.
9. Test concurrent interleavings.
10. Monitor contention.

## Decision points
Use Serializable for complex invariants when retry is acceptable; explicit row locks for targeted coordination; optimistic patterns when conflicts are uncommon.

## Common failure patterns
Long transactions, assuming Read Committed is repeatable, retrying non-idempotent side effects, application-only uniqueness checks.

## Verification
Run concurrent tests demonstrating invariants and bounded conflict handling.

## Expected output
Transaction design, isolation rationale, retry policy, concurrency tests.

## Stop conditions
Escalate when invariant ownership spans systems without an agreed consistency model.