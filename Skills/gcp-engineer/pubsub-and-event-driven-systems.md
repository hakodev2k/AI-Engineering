# Pub/Sub and Event-Driven Systems

## Purpose
Design reliable asynchronous systems on Pub/Sub with explicit delivery, ordering, retry, dead-letter, schema, and idempotency behavior.

## When to use
Use for decoupled services, event fan-out, ingestion pipelines, integration events, or background processing.

## Inputs
Event contracts, throughput, ordering needs, consumer count, latency target, retry policy, and failure semantics.

## Context to inspect
Topics, subscriptions, filters, retention, dead-letter topics, retry configuration, schemas, push/pull mode, and subscriber acknowledgment behavior.

## Core knowledge
Pub/Sub provides at-least-once delivery in common patterns; consumers must tolerate duplicates. Ordering keys trade throughput for sequence guarantees within a key.

## Procedure
1. Define event ownership and contract.
2. Decide event versus command semantics.
3. Define idempotency key and duplicate handling.
4. Choose pull, push, or managed connector consumption.
5. Configure acknowledgment deadlines from observed processing time.
6. Bound retries and create dead-letter handling.
7. Add filtering and ordering only when needed.
8. Version schemas compatibly.
9. Monitor backlog age, delivery attempts, and processing errors.
10. Test replay and poison-message behavior.

## Decision points
Use ordering only for business-critical sequence requirements. Use separate subscriptions for independent consumer failure domains.

## Common failure patterns
Assuming exactly-once business effects, infinite retry loops, non-idempotent handlers, large payload abuse, and no dead-letter ownership.

## Verification
Inject duplicates, poison events, delayed consumers, and replay scenarios; verify final business state.

## Expected output
A resilient event-processing design.

## Stop conditions
Stop if event contract ownership or duplicate semantics are undefined.