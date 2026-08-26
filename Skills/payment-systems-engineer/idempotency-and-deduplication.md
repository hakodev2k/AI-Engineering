# Idempotency and Deduplication

## Purpose
Prevent retries, duplicate requests, and repeated events from creating duplicate monetary effects.

## When to use
Use for payment creation, capture, refund, payout, webhook processing, message consumption, and retryable commands.

## Inputs
Operation semantics, client/provider identifiers, retry policy, storage guarantees, event delivery guarantees.

## Preconditions
Know which side effects must occur at most once from the business perspective and which operations are naturally idempotent.

## Context to inspect
API contracts, database constraints, idempotency tables, queues, webhook handlers, retry middleware, transaction boundaries.

## Core knowledge
Networks provide at-least-once realities. Exactly-once business effects are usually achieved with durable identities, atomic state changes, uniqueness constraints, and replay-safe handlers—not transport promises alone.

## Procedure
1. Define the logical operation identity.
2. Choose idempotency key scope and retention period.
3. Bind keys to normalized request semantics where appropriate.
4. Persist operation state before or atomically with side effects.
5. Add database uniqueness as a final duplicate barrier.
6. Return the original result for legitimate retries.
7. Reject key reuse with materially different payloads.
8. Make downstream calls idempotent where possible.
9. Deduplicate inbound events using stable provider event IDs.
10. Handle concurrent duplicate arrivals explicitly.
11. Define cleanup without reopening the duplicate window.
12. Test retries at every failure boundary.

## Decision points
Use client keys for command retries, provider event IDs for webhook deduplication, and domain operation IDs for internal workflows. Retention must exceed realistic replay windows.

## Common failure patterns
In-memory dedupe, check-then-insert races, short retention, random keys regenerated on retry, and treating HTTP success as proof of a single effect.

## Verification
Run concurrent duplicate requests, replay events, inject failures before/after commits and external calls, and prove one business effect remains.

## Expected output
A documented idempotency contract with durable storage, concurrency protection, replay behavior, and tests.

## Stop conditions
Escalate if no stable operation identity exists or an external provider lacks safe retry semantics for a critical irreversible action.