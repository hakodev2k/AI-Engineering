# Idempotent Consumers

## Purpose
Ensure repeated delivery does not produce repeated business effects.

## When to use
Use for at-least-once delivery, retries, replay, webhook/event consumers, and uncertain acknowledgements.

## Inputs
Message identifiers, business keys, side effects, persistence model, retention window.

## Context to inspect
Consumer transaction boundaries, unique constraints, downstream APIs, duplicate windows, and existing dedupe mechanisms.

## Core knowledge
Idempotency can be achieved through naturally idempotent state transitions, uniqueness constraints, inbox records, conditional writes, or downstream idempotency keys. Dedupe duration must cover realistic redelivery/replay windows.

## Procedure
1. Enumerate all side effects.
2. Identify a stable event or operation identity.
3. Prefer business-state invariants over ad hoc caches.
4. Put dedupe state and local effects in one transaction where possible.
5. Pass idempotency keys to external systems that support them.
6. Define retention and cleanup for dedupe records.
7. Handle concurrent duplicate processing.
8. Test duplicates before, during, and after crashes.
9. Observe duplicate suppression metrics.

## Decision points
Use unique constraints for simple creates, inbox tables for durable consumer dedupe, and conditional version updates for state transitions. Avoid volatile cache-only dedupe for critical effects.

## Common failure patterns
Random identifiers per retry, check-then-act races, dedupe outside the effect transaction, permanent dedupe growth, and assuming PUT semantics make arbitrary workflows idempotent.

## Verification
Repeated and concurrent copies of the same event produce one logical effect; crash tests do not create duplicate external or local outcomes.

## Expected output
A bounded, concurrency-safe idempotency mechanism with tests and observability.

## Stop conditions
Stop if no stable identity exists or external irreversible side effects cannot be made safely repeatable.