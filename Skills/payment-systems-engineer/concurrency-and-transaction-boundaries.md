# Concurrency and Transaction Boundaries

## Purpose
Protect monetary invariants when multiple requests, workers, callbacks, or operators mutate the same payment state concurrently.

## When to use
Use for captures, refunds, balance changes, payout execution, webhook processing, and distributed workflows.

## Inputs
State invariants, database capabilities, expected contention, external side effects, message delivery model.

## Context to inspect
Transactions, isolation levels, row versions, locks, unique constraints, queues, retries, outbox/inbox patterns.

## Core knowledge
Database transactions cannot atomically include arbitrary external APIs. Correct designs combine local atomicity, durable workflow state, idempotency, and reconciliation. Concurrency controls must protect business invariants, not merely individual rows.

## Procedure
1. State the invariant mathematically or precisely.
2. Identify all concurrent mutation paths.
3. Choose the smallest authoritative transaction boundary.
4. Use constraints to enforce invariants where possible.
5. Choose optimistic concurrency for low contention and pessimistic locking only when justified.
6. Keep locks short and avoid external calls while holding them.
7. Persist workflow intent before external side effects when recovery requires it.
8. Use outbox/inbox patterns for reliable event publication/consumption.
9. Handle serialization/concurrency failures with bounded retries.
10. Make retries idempotent.
11. Add race tests and failure injection.

## Decision points
Prefer optimistic concurrency when conflicts are exceptional; use serialization/locking for high-value invariants where contention is expected and latency impact is acceptable.

## Common failure patterns
Check-then-update races, distributed locks as the only correctness layer, external calls inside DB transactions, and retries without idempotency.

## Verification
Run concurrent mutation tests, force transaction conflicts, crash at boundary points, and prove invariants survive replay/recovery.

## Expected output
Explicit transaction boundaries and concurrency controls that preserve monetary correctness under races and failures.

## Stop conditions
Escalate when required atomicity spans systems without a viable compensation or reconciliation strategy.