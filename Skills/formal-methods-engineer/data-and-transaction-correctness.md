# Data and Transaction Correctness

## Purpose
Verify data invariants and transactional behavior across concurrent updates, retries, replication, and failure recovery.

## When to use
Use for financial state, inventory, quotas, idempotent workflows, replicated databases, or any system where corrupted state is more costly than temporary unavailability.

## Inputs
Data model, invariants, transaction boundaries, isolation level, retry behavior, replication semantics, and recovery rules.

## Preconditions
The storage system's consistency and isolation guarantees must be known.

## Context to inspect
Constraints, indexes that enforce uniqueness, read/write paths, optimistic concurrency, locking, outbox/inbox patterns, replication lag, and compensations.

## Core knowledge
Application invariants interact with isolation levels. Serializability, snapshot isolation, read committed, and eventual consistency permit different anomalies. Idempotency and uniqueness are distinct properties, and retries can amplify weak transaction design.

## Procedure
1. Identify data invariants and ownership boundaries.
2. Map each invariant to reads and writes that can affect it.
3. Model concurrent transactions and allowed anomalies.
4. Encode abort, retry, duplicate request, and crash behavior.
5. Check uniqueness, conservation, monotonicity, and ordering properties as relevant.
6. Analyze replica reads and stale-state decisions.
7. Verify compensation logic does not violate stronger invariants.
8. Determine whether database constraints can enforce critical properties directly.
9. Model schema or migration states when transitions affect correctness.
10. Add concurrency tests derived from formal counterexamples.

## Decision points
Prefer stronger isolation when correctness risk outweighs throughput cost. Use application-level coordination only when storage guarantees cannot express the invariant efficiently.

## Common failure patterns
Assuming transactions imply serial execution, retrying non-idempotent writes, relying on application checks without atomic enforcement, ignoring replica lag, and modeling rollback but not partial external effects.

## Verification
Check anomaly histories, model concurrent schedules, validate database constraints, and reproduce counterexamples with integration tests where feasible.

## Expected output
Verified data invariants, required isolation/coordination controls, counterexamples, and implementation tests.

## Stop conditions
Stop when actual storage guarantees are unknown, external side effects cannot be reconciled with transaction semantics, or destructive changes require separate approval.