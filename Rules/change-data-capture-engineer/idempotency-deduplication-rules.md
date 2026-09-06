# Idempotency and Deduplication Rules

## Purpose
Ensure retries and replay do not create incorrect downstream state.

## Scope
Event identity, sink writes, deduplication windows, upserts, and side effects.

## MUST
- Consumers or sinks exposed to retries MUST have an idempotency strategy.
- Deduplication keys MUST be derived from stable source identity and position where practical.
- Deduplication retention MUST cover the maximum supported replay or retry window.
- Side-effecting consumers MUST distinguish replayed events from new business actions when required.
- Idempotency behavior MUST be tested under repeated delivery.

## MUST NOT
- MUST NOT deduplicate solely by payload hash when distinct legitimate changes can share payloads.
- MUST NOT use short-lived in-memory deduplication for durable correctness requirements.
- MUST NOT assume upsert alone resolves ordering errors.

## SHOULD
- Prefer deterministic state application over imperative side effects.
- Record deduplication decisions for investigation when practical.

## Exceptions
Non-idempotent sinks require controlled serialization, compensating controls, and explicit risk approval.

## Verification
Replay duplicate fixtures, inspect sink state, test deduplication expiry, and review event identity construction.