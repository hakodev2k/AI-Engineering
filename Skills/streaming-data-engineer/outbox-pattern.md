# Transactional Outbox Pattern

## Purpose
Publish events reliably alongside database state changes without unsafe dual writes.

## When to use
Use when an application must atomically persist business state and eventually publish an event.

## Inputs
Database transaction, event contract, publisher/CDC mechanism, delivery requirements.

## Context to inspect
Transaction boundaries, outbox schema, cleanup, relay offsets, idempotency, ordering needs.

## Core knowledge
Dual writes cannot be made atomic by ordering two independent systems. An outbox stores business change and publish intent in one local transaction, then relays asynchronously.

## Procedure
1. Identify atomic business state and event intent.
2. Write both in one database transaction.
3. Give each outbox record stable identity.
4. Relay via CDC or polling with durable progress.
5. Make downstream handling idempotent.
6. Preserve required per-aggregate ordering.
7. Define retention/cleanup after confirmed relay.
8. Monitor backlog age and failures.
9. Test crashes at every relay boundary.

## Decision points
Prefer CDC relay at scale when available; polling may be simpler at modest volume. Do not use outbox when no database transaction participates.

## Common failure patterns
Deleting before durable publish; non-transactional outbox insert; no deduplication; unbounded outbox growth.

## Verification
Fault injection proves committed business changes eventually emit events without unacceptable duplication or loss.

## Expected output
Outbox schema, relay design, cleanup policy, and recovery tests.

## Stop conditions
Stop if atomic local persistence cannot include the outbox record.