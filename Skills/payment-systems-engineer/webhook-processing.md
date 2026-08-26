# Webhook Processing

## Purpose
Process asynchronous payment-provider notifications securely, durably, and safely under duplicates and reordering.

## When to use
Use for payment, dispute, refund, payout, settlement, or account webhooks.

## Inputs
Provider signing scheme, event schema, delivery guarantees, event IDs, domain transition rules.

## Context to inspect
Ingress endpoint, signature validation, queueing, dedupe store, handlers, state machine, logs, dead-letter handling.

## Core knowledge
Webhook delivery is typically at least once and may be delayed or reordered. Authenticity validation must use the provider's exact signed payload rules. Acknowledgement and business processing should be decoupled when processing can exceed delivery timeouts.

## Procedure
1. Preserve the raw request bytes required for signature verification.
2. Validate signature, timestamp, and replay window.
3. Reject oversized or malformed payloads safely.
4. Extract stable event and resource IDs.
5. Persist/deduplicate the event durably.
6. Acknowledge according to provider retry semantics.
7. Process through domain transition rules.
8. Handle stale and out-of-order events by comparing authoritative state/evidence.
9. Make handlers idempotent.
10. Quarantine poison events after bounded retries.
11. Provide replay tooling with authorization and audit.
12. Monitor age, failure rate, backlog, and dead letters.

## Decision points
Fetch current provider state when event ordering cannot be trusted and the provider offers an authoritative query API.

## Common failure patterns
Parsing before signature verification, trusting event order, returning success before durable receipt, infinite retries, and logging sensitive payloads.

## Verification
Replay identical events, reorder them, tamper signatures, inject handler failures, and verify exactly one valid domain effect and recoverable dead-letter behavior.

## Expected output
A secure, replay-safe webhook pipeline with durable receipt, deduplication, observability, and recovery.

## Stop conditions
Escalate when signature requirements or authoritative event identity are unavailable.