# Webhook Reliability and Security

## Purpose
Receive and process webhooks safely under duplication, reordering, retries, spoofing attempts, and temporary downstream failure.

## When to use
Use for inbound event callbacks from SaaS platforms, payment systems, source-control providers, messaging systems, or internal services.

## Inputs
Webhook provider documentation, signing scheme, retry policy, event schema, delivery identifiers, expected volume, and processing SLA.

## Context to inspect
Inspect endpoint exposure, signature validation, secret rotation, request size limits, replay protection, historical failures, and downstream side effects.

## Core knowledge
Webhook endpoints should authenticate the sender before trusting payloads, acknowledge within provider deadlines, and decouple receipt from long work. At-least-once delivery makes idempotency mandatory for side effects.

## Procedure
1. Confirm provider signing and delivery semantics.
2. Enforce TLS and validate signatures against the raw request body where required.
3. Apply timestamp or nonce checks when the provider supports replay protection.
4. Validate content type, event type, size, and schema.
5. Record a stable delivery ID before side effects.
6. Acknowledge quickly and enqueue longer processing when appropriate.
7. Deduplicate repeated deliveries.
8. Separate transient dependency failures from permanent payload failures.
9. Route unrecoverable events to a reviewable dead-letter path.
10. Define secret rotation without downtime.
11. Monitor signature failures, processing lag, retries, and dead letters.

## Decision points
Process synchronously only when work is short and provider deadlines are safe. Queue when downstream latency or burstiness is material. Reject unverifiable payloads rather than attempting best-effort processing.

## Common failure patterns
Parsing before signature validation, logging secrets, returning success before durable receipt, trusting source IP alone, duplicate side effects, and retry storms.

## Verification
Replay captured safe fixtures, alter signatures, resend duplicates, delay downstream dependencies, and confirm expected acknowledgements and single business effects.

## Expected output
A secure webhook ingestion path with authentication, validation, deduplication, durable handoff, monitoring, and recovery behavior.

## Stop conditions
Stop when sender authenticity cannot be established or duplicate delivery could cause an irreversible effect without a deduplication strategy.