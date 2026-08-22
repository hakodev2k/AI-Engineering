# Webhooks and Event Delivery

## Purpose
Design outbound webhook integrations that are secure, retryable, observable, and safe under duplicate delivery.

## When to use
Use when notifying external consumers asynchronously about domain events.

## Inputs
Event definitions, subscriber model, security requirements, delivery SLOs, and retry policy.

## Context to inspect
Event source, queue/outbox, signing secrets, endpoint registration, delivery logs, and dead-letter handling.

## Core knowledge
Webhook delivery is at-least-once in most practical systems. Consumers must tolerate duplicates; producers need durable delivery state, bounded retries, signatures, and replay controls.

## Procedure
1. Define stable event types and schemas.
2. Assign unique event IDs and timestamps.
3. Persist events durably before delivery.
4. Sign payloads with rotation support.
5. Apply timeouts and bounded exponential backoff.
6. Record attempts and responses safely.
7. Dead-letter exhausted deliveries.
8. Provide replay/recovery mechanisms.
9. Document consumer idempotency expectations.
10. Test duplicates, delays, invalid signatures, and outages.

## Decision points
Use webhooks for external push integration; prefer internal messaging when both producer and consumer are inside a controlled platform.

## Common failure patterns
Synchronous webhook calls inside business transactions, infinite retries, unsigned payloads, secret leakage, and assuming exactly-once delivery.

## Verification
Fault tests prove durable retry, duplicate safety, signature validation, and operational visibility.

## Expected output
A production-ready webhook delivery contract and workflow.

## Stop conditions
Escalate if sensitive events lack an approved trust and key-management model.