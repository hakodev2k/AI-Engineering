# Webhook and Event Rules

## Purpose
Govern asynchronous API contracts so delivery, duplication, ordering, and evolution are explicit.

## Scope
Applies to webhooks, event streams, callbacks, and externally consumed asynchronous notifications.

## MUST
- Event contracts MUST define event identity, producer, timestamp semantics, payload schema, and delivery guarantees.
- Consumers MUST be told whether duplicate, delayed, reordered, or missing deliveries are possible.
- Event handlers MUST be able to deduplicate when at-least-once delivery is promised.
- Schema evolution MUST follow compatibility rules appropriate to stored and delayed events.
- Webhook delivery MUST use authenticated or integrity-protected transport and MUST define retry and expiration behavior.
- Replay mechanisms MUST enforce the same authorization and data-exposure controls as live delivery.

## MUST NOT
- Consumers MUST NOT be required to infer event type from free-form payload content.
- Delivery success MUST NOT be assumed solely because an event was accepted by an intermediary.
- Sensitive data MUST NOT be included in events without explicit need and review.

## SHOULD
- Event envelopes SHOULD be consistent across the portfolio.
- Dead-letter or failure visibility SHOULD exist for operationally critical delivery paths.

## Exceptions
Exceptions require documented semantics, failure analysis, consumer impact, security review where relevant, and approval.

## Verification
Run duplicate, reorder, delay, retry, invalid-signature, schema-evolution, and replay tests. Inspect delivery telemetry and event contract documentation.