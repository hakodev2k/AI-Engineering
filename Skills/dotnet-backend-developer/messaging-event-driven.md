# Messaging and Event-Driven Integration

## Purpose
Design robust asynchronous integration using queues/events with explicit delivery, ordering, idempotency, schema, and failure semantics.

## When to use
Decoupled workflows, integration events, load leveling, asynchronous commands, or replacing fragile synchronous chains.

## Inputs
Business workflow, broker capabilities, delivery guarantees, event schemas, ordering needs, retry/DLQ requirements.

## Context to inspect
Producer transaction boundary, consumer behavior, message keys, retries, dead-lettering, schema/versioning, observability.

## Core knowledge
At-least-once is common; duplicates happen; ordering is scoped; consumers must be idempotent; events describe facts while commands request action; outbox solves DB+publish gap.

## Procedure
1. Define message intent and owner.
2. Design minimal versionable schema.
3. Choose partition/key only when ordering needs justify it.
4. Make consumers idempotent.
5. Use transactional outbox when DB state and publish must coordinate.
6. Bound retries and route poison messages.
7. Preserve correlation/causation metadata.
8. Monitor lag, failure, retry, and DLQ volume.
9. Test duplicate/out-of-order delivery.

## Decision points
Use synchronous HTTP when immediate response is required and coupling is acceptable; messaging when temporal decoupling and resilience justify operational complexity.

## Common failure patterns
Treating events as RPC, huge payloads, breaking schema changes, infinite retries, no dedupe, assuming global order.

## Verification
Contract tests, duplicate/out-of-order tests, outbox recovery tests, DLQ drills.

## Expected output
Versionable asynchronous workflows tolerant of expected delivery behavior.

## Stop conditions
Escalate cross-domain semantic ownership disputes or exactly-once requirements.