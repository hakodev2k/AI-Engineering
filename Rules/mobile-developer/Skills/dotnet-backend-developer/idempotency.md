# Idempotency

## Purpose
Prevent duplicate effects when clients, queues, or retry policies repeat the same logical operation.

## When to use
Payment/order-like commands, external callbacks, message consumers, retried POSTs, scheduled jobs, or any operation with costly duplicate side effects.

## Inputs
Operation identity, side effects, retry sources, persistence model, retention window.

## Context to inspect
Unique keys, request identifiers, database constraints, outbox/inbox tables, response replay needs, concurrency behavior.

## Core knowledge
Idempotency means repeated equivalent requests produce one logical effect. Detection must be atomic with the protected state transition or duplicate races remain.

## Procedure
1. Define logical operation identity.
2. Choose caller-provided idempotency key or deterministic business key.
3. Define retention and key scope.
4. Enforce uniqueness transactionally.
5. Store enough result/status to respond to duplicates.
6. Handle concurrent first attempts deterministically.
7. Avoid re-running external side effects after commit uncertainty without reconciliation.
8. Test retries and races.

## Decision points
Use database uniqueness for durable business identity; dedicated idempotency records when request replay/status must be tracked independently.

## Common failure patterns
In-memory dedupe in multi-instance systems, check-then-insert races, keys without tenant scope, deleting keys too early, retrying unknown external outcomes blindly.

## Verification
Concurrent duplicate tests, restart tests, retention tests, reconciliation scenarios.

## Expected output
Exactly one intended business effect under realistic duplicate delivery.

## Stop conditions
Escalate operations involving irreversible external effects with no query/reconciliation API.