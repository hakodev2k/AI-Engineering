# Transaction and Consistency Design

## Purpose
Choose transaction boundaries and consistency mechanisms that preserve correctness without unnecessary coupling or contention.

## When to use
Use for multi-step writes, concurrent updates, workflows spanning services, or duplicate/lost-update bugs.

## Inputs
Business invariants, data stores, workflow steps, concurrency profile, failure scenarios, messaging guarantees.

## Context to inspect
Existing transactions, isolation levels, locks, version fields, outbox/inbox logic, retries, and service boundaries.

## Core knowledge
ACID, isolation anomalies, optimistic/pessimistic concurrency, idempotency, sagas, outbox pattern, eventual consistency, and compensation.

## Procedure
1. State the invariant that must survive failures/concurrency.
2. Identify data under one transactional authority.
3. Keep local transactions minimal and explicit.
4. Choose isolation/concurrency controls for observed contention.
5. For cross-service workflows, define durable state transitions and idempotent messages.
6. Use outbox/inbox or equivalent when atomic data-plus-message intent is required.
7. Define compensation for non-atomic external effects.
8. Test retries, duplicates, races, partial failures, and recovery.

## Decision points
Prefer local ACID for data under one authority; use eventual consistency across independent services. Choose optimistic locking for low contention and pessimistic locking only when blocking cost is justified.

## Common failure patterns
Distributed transactions by accident, long-held locks, retries without idempotency, missing compensation, hidden transaction scopes, and assuming exactly-once delivery.

## Verification
Run concurrency and fault-injection tests and prove invariants after duplicate, reordered, failed, and retried operations.

## Expected output
Explicit consistency model, transaction boundaries, recovery behavior, and tests.

## Stop conditions
Stop when invariants are undefined or external systems cannot provide the guarantees needed for a safe design.