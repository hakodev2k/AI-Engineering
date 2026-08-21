# Messaging and Event Testing

## Purpose
Validate asynchronous workflows, delivery semantics, idempotency, ordering assumptions, and eventual consistency.

## When to use
Use for queues, topics, event buses, background consumers, and event-driven integrations.

## Inputs
Message contracts, topology, delivery guarantees, retry/dead-letter policy, business workflow.

## Context to inspect
Producer/consumer boundaries, correlation IDs, duplicate delivery, ordering, visibility/lock timeouts, retries, poison messages, DLQ, and eventual state.

## Core knowledge
Most messaging systems provide at-least-once effects in practice. Tests must tolerate asynchronous completion while proving idempotency and bounded convergence. Never synchronize with fixed sleeps.

## Procedure
1. Identify message-triggered business invariants.
2. Publish through the real producer boundary when practical.
3. Correlate messages and resulting state uniquely.
4. Wait on observable completion with bounded polling/events.
5. Verify successful processing and side effects.
6. Deliver duplicates and confirm idempotent outcomes.
7. Inject transient failures and verify retry behavior.
8. Inject permanent failures and verify DLQ/alerting.
9. Test ordering only where the design promises it.
10. Validate contract compatibility across versions.

## Decision points
Use real broker integration for topology/semantics; use in-process fakes for fast business logic. Do not let mocks substitute for broker-specific guarantees.

## Common failure patterns
Fixed sleeps, assuming exactly-once delivery, shared queues across tests, missing correlation, never testing poison messages.

## Verification
Observe broker state, consumer logs, retries, final business state, and duplicate behavior under repeated runs.

## Expected output
Deterministic asynchronous tests with explicit delivery and failure semantics.

## Stop conditions
Escalate when shared broker environments cannot isolate destructive/failure scenarios.