# Transactions and Isolation

## Purpose
Design correct MySQL transaction boundaries and isolation behavior under concurrency.

## When to use
Use for multi-statement invariants, race conditions, deadlocks, lost updates, or consistency reviews.

## Inputs
Business invariant, SQL sequence, concurrency model, isolation level, failure/retry behavior.

## Context to inspect
Autocommit settings, transaction scope, lock order, indexes, isolation level, ORM behavior, external calls inside transactions.

## Core knowledge
InnoDB uses MVCC plus locking. Isolation level changes visibility and locking behavior; correct indexing affects lock footprint. Transactions should be short, deterministic, and free of avoidable external waits.

## Procedure
1. State the invariant that must remain true.
2. Identify competing transactions and interleavings.
3. Define the smallest atomic unit.
4. Select isolation/locking semantics intentionally.
5. Ensure predicates are indexed to constrain locks.
6. Establish consistent lock ordering.
7. Keep network/external calls outside transactions when possible.
8. Implement bounded retry for retryable deadlocks/conflicts.
9. Test concurrent interleavings.
10. Observe lock waits and transaction duration.

## Decision points
Use optimistic concurrency for low-conflict workflows; explicit locking for invariants requiring serialized decisions; stronger isolation only when its correctness benefit warrants contention.

## Common failure patterns
Long transactions, hidden ORM transactions, retrying non-idempotent work, unindexed locking predicates, assuming REPEATABLE READ means no anomalies, and mixing remote calls with held locks.

## Verification
Run concurrency tests, inspect final invariants, deadlock logs, lock waits, and rollback behavior.

## Expected output
Documented transaction boundary, isolation rationale, retry policy, and concurrency tests.

## Stop conditions
Stop when the invariant is undefined, retry safety is unknown, or the change requires global isolation changes without workload testing.