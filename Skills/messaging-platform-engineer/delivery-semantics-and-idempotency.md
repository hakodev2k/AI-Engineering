# Delivery Semantics and Idempotency

## Purpose
Choose and implement delivery guarantees that preserve business correctness under retries, duplicates, redelivery, and partial failure.

## When to use
Use when designing producer/consumer behavior, reviewing duplicate processing, or deciding whether at-most-once, at-least-once, or transactional patterns are appropriate.

## Inputs
- Message flow and business side effects
- Broker capabilities
- Consumer storage model
- Retry and timeout policies
- Ordering requirements

## Context to inspect
Inspect producer acknowledgements, consumer commit/ack behavior, retry logic, database transactions, deduplication keys, and side effects such as payments, emails, or external API calls.

## Core knowledge
Exactly-once end-to-end behavior is usually a system property, not a broker toggle. Senior engineers should understand producer idempotence, transactional publishing, consumer offsets, deduplication, inbox/outbox patterns, atomicity boundaries, and replay behavior.

## Procedure
1. Identify the correctness invariant for each side effect.
2. Determine where duplicates can be introduced.
3. Choose the weakest delivery guarantee that still preserves correctness.
4. Define stable message or operation identifiers.
5. Make consumers idempotent where practical.
6. Align acknowledgement/offset commits with durable state changes.
7. Use transactional outbox/inbox patterns when database and broker atomicity cannot be shared.
8. Define retry and replay behavior explicitly.
9. Test crash points before and after side effects.
10. Document residual duplicate or loss risks.

## Decision points
Prefer at-least-once plus idempotency for most business workflows. Use broker transactions only when their scope and operational cost are justified. Use at-most-once only where loss is acceptable and duplicate avoidance dominates.

## Common failure patterns
- Claiming exactly-once because the broker supports transactions
- Acknowledging before durable processing completes
- Deduplicating with volatile in-memory state
- Non-idempotent external calls during redelivery
- Infinite retention of deduplication records without lifecycle rules

## Verification
Inject failures at producer, broker, consumer, and persistence boundaries; replay messages; confirm no forbidden duplicate side effects or silent message loss occurs.

## Expected output
A documented delivery model with acknowledgement boundaries, idempotency strategy, retry behavior, and verified failure scenarios.

## Stop conditions
Stop when the business invariant is undefined, an external side effect cannot be made safe under retry, or the chosen guarantee cannot be validated with available infrastructure.