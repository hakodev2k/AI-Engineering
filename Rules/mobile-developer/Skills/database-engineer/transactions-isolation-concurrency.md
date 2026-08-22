# Transactions, Isolation, and Concurrency

## Purpose
Design transaction boundaries and isolation behavior that preserve correctness without unnecessary blocking or contention.

## When to use
Use for multi-step writes, race conditions, lost updates, inconsistent reads, deadlocks, and high-concurrency workflows.

## Inputs
Business invariants, transaction flows, read/write sets, isolation settings, lock behavior, concurrency rate, and failure semantics.

## Context to inspect
Inspect application transaction boundaries, implicit transactions, ORM behavior, stored procedures, retries, indexes, and external calls performed inside transactions.

## Core knowledge
Isolation levels trade anomaly prevention against concurrency. Transaction correctness depends on business invariants, access order, lock duration, versioning behavior, and retry semantics.

## Procedure
1. State the invariant that concurrent operations must preserve.
2. Map all reads and writes participating in the decision.
3. Identify possible anomalies and race windows.
4. Inspect current isolation and engine versioning behavior.
5. Keep transaction scope minimal while preserving atomicity.
6. Choose optimistic or locking coordination deliberately.
7. Establish consistent resource access order where practical.
8. Make retries safe and bounded.
9. Test simultaneous conflicting operations.
10. Monitor blocking, aborts, and transaction duration.

## Decision points
Use stronger isolation only when required by invariants. Prefer optimistic concurrency for low-conflict workflows; locking can be appropriate when conflicts are frequent and serialization is intentional.

## Common failure patterns
Long transactions, network calls inside transactions, read-then-write races, assuming default isolation guarantees business correctness, and retrying non-idempotent work blindly.

## Verification
Run concurrency tests that attempt the actual race, validate final state, and inspect lock or version behavior.

## Expected output
Documented transaction boundaries, isolation rationale, conflict strategy, retry rules, and concurrency tests.

## Stop conditions
Escalate when correctness requirements are ambiguous or cross-system atomicity is being assumed without a valid protocol.