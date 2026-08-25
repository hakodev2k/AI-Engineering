# Idempotency and Deduplication Rules

## Purpose
Prevent repeated delivery or replay from creating incorrect business effects.

## Scope
Applies to consumers, sinks, command bridges, event identifiers, and deduplication stores.

## MUST
- Operations exposed to duplicate delivery MUST define an idempotency strategy when repeated effects are unsafe.
- Deduplication keys MUST be stable, collision-resistant within their scope, and derived from documented event identity semantics.
- Deduplication state retention MUST cover the credible duplicate window or explicitly document residual risk.
- Side effects and deduplication markers MUST be coordinated atomically where partial completion could create corruption.
- Replays MUST preserve or deliberately remap identity according to the replay contract.

## MUST NOT
- MUST NOT use payload equality as event identity unless that is the explicit domain rule.
- MUST NOT treat an in-memory cache as durable deduplication for failure-sensitive effects.
- MUST NOT generate a new event ID on every retry when downstream deduplication depends on the original identity.

## SHOULD
- Idempotent upserts, conditional writes, or transactional outbox/inbox patterns SHOULD be preferred over fragile duplicate detection where suitable.
- Deduplication metrics SHOULD expose suppressed duplicates and store failures.

## Exceptions
Non-idempotent handling requires quantified duplicate risk, compensating controls, business acceptance, and operational detection.

## Verification
Run duplicate-delivery tests, crash tests around side effects, replay tests, storage-retention inspection, and reconciliation against authoritative state.