# Delivery Semantics and Idempotency

## Purpose
Design consumers and producers that remain correct under duplicates, retries, crashes, and partial failures.

## When to use
Use for side-effecting consumers, financial/state transitions, retry design, and duplicate incidents.

## Inputs
Broker guarantees, processing transaction boundaries, side effects, identifiers, retry behavior.

## Context to inspect
Offset commits, producer acknowledgments, transactional support, deduplication stores, downstream API semantics.

## Core knowledge
At-most-once risks loss; at-least-once permits duplicates; exactly-once usually applies only within constrained broker/processor boundaries. Business correctness often depends on idempotent effects and stable event identities.

## Procedure
1. Define unacceptable outcomes: loss, duplication, reordering.
2. Map event read, state mutation, side effect, and offset commit boundaries.
3. Assign stable event/operation identifiers.
4. Make mutations naturally idempotent where possible.
5. Add deduplication when natural idempotency is unavailable.
6. Use transactions/outbox patterns where boundaries permit.
7. Bound retry and dedup retention.
8. Test crash points before and after every side effect.

## Decision points
Prefer natural idempotency over large dedup stores. Use broker transactions only when all relevant effects participate; otherwise design compensating or idempotent external effects.

## Common failure patterns
Committing offsets before durable effects; dedup keys based on timestamps; assuming exactly-once covers HTTP/database side effects; infinite dedup retention.

## Verification
Fault-injection tests prove no unacceptable duplicate/loss outcomes across crash boundaries.

## Expected output
Explicit delivery contract, idempotency mechanism, and failure tests.

## Stop conditions
Stop if stable operation identity or transactional boundaries cannot be established for a correctness-critical flow.