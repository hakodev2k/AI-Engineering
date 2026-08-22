# Event-Driven Architecture

## Purpose
Design event flows that decouple producers and consumers while preserving clear semantics, ownership, reliability, and operability.

## When to use
Use for asynchronous integration, domain notifications, fan-out processing, temporal decoupling, and independently scalable consumers.

## Inputs
Domain boundaries, event candidates, consumer needs, delivery guarantees, schema requirements, and latency expectations.

## Context to inspect
Inspect producer transactions, broker topology, consumer ownership, schema registry/contracts, retries, dead-letter handling, and observability.

## Core knowledge
Events describe facts that occurred; commands request action. Event-driven systems trade synchronous coupling for temporal and operational complexity including duplication, ordering, schema evolution, and delayed failure.

## Procedure
1. Define producer ownership and business fact.
2. Name events in past tense with stable semantics.
3. Define minimal durable contract and metadata.
4. Choose partition/routing key based on ordering and scale needs.
5. Establish publication reliability.
6. Design consumers as idempotent and independently deployable.
7. Define retry, poison-message, and replay policies.
8. Plan schema evolution and compatibility.
9. Add correlation, lag, failure, and throughput telemetry.
10. Test duplicate, delayed, reordered, and replayed events.

## Decision points
Use events when consumers should react independently and delayed completion is acceptable. Prefer synchronous APIs when the caller needs immediate authoritative outcome.

## Common failure patterns
Events used as disguised RPC, huge internal object serialization, unclear ownership, shared consumer databases, and no replay strategy.

## Verification
Validate contracts, delivery behavior, consumer idempotency, replay, lag monitoring, and compatibility across producer/consumer versions.

## Expected output
An explicit event contract and operationally complete producer/consumer design.

## Stop conditions
Stop when ownership or semantic meaning of the event is ambiguous or asynchronous behavior violates required user guarantees.