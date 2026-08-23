# Message Delivery Rules

## Purpose
Preserve correctness across asynchronous message delivery.

## Scope
Queues, streams, event buses, and background consumers.

## MUST
- Delivery semantics MUST be explicit: at-most-once, at-least-once, or effectively-once.
- Consumers MUST tolerate duplicate and out-of-order delivery where the transport permits it.
- Poison messages MUST have bounded retry and quarantine handling.

## MUST NOT
- MUST NOT acknowledge a message before required durable effects are safe unless loss is acceptable by design.
- MUST NOT drop failed messages silently.

## SHOULD
- Consumers SHOULD expose lag, failure, retry, and dead-letter metrics.

## Exceptions
Message loss requires explicit business acceptance and observable evidence.

## Verification
Review broker settings, consumer code, replay tests, dead-letter behavior, and delivery metrics.