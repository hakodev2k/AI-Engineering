# Event-Driven Architecture

## Purpose
Design event-based collaboration that reduces temporal coupling while preserving clear semantics, reliability, and ownership.

## When to use
Use when workflows span modules/services, asynchronous processing is valuable, or producers and consumers should evolve independently.

## Inputs
Business events, workflows, consistency requirements, broker capabilities, consumer inventory, failure expectations.

## Context to inspect
Existing queues/topics, schemas, retry policies, dead-letter handling, ordering assumptions, idempotency, observability, and ownership.

## Core knowledge
Events should represent facts that happened. Delivery is commonly at-least-once, so consumers must tolerate duplicates. Ordering is usually scoped, not global. Event schemas are contracts and require lifecycle management.

## Procedure
1. Identify business facts worth publishing.
2. Separate commands from events.
3. Define event ownership and schema.
4. Choose topic/queue topology and partitioning.
5. Define delivery, ordering, retry, and dead-letter semantics.
6. Make consumers idempotent.
7. Handle schema evolution compatibly.
8. Add correlation and end-to-end observability.
9. Test duplicate, delayed, failed, and out-of-order delivery.

## Decision points
Use events when eventual consistency is acceptable and decoupling has value. Use synchronous calls when the caller needs immediate authoritative results. Avoid event sourcing unless audit/history requirements justify its complexity.

## Common failure patterns
Publishing database-shaped events, hidden command semantics, assuming exactly-once delivery, missing idempotency, unbounded retries, and undocumented schema changes.

## Verification
Replay representative events and validate duplicates, failures, ordering, compatibility, and recovery behavior.

## Expected output
An explicit event model with contracts, delivery semantics, consumer responsibilities, and recovery rules.

## Stop conditions
Stop when event ownership, consistency expectations, or recovery semantics cannot be agreed.