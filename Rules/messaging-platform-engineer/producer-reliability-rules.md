# Producer Reliability Rules

## Purpose
Ensure producers publish messages predictably without silent loss, duplicate storms, or hidden partial failure.

## Scope
Producer clients, batching, acknowledgements, retries, serialization, and publish confirmation.

## MUST
- Producers MUST use durability and acknowledgement settings consistent with the business loss tolerance.
- Publish failures MUST be surfaced with enough context to retry or reconcile safely.
- Retries MUST be bounded and compatible with idempotency behavior.
- Serialization failures MUST fail before a message is treated as published.

## MUST NOT
- MUST NOT treat enqueue-to-local-buffer as durable broker acceptance unless the client contract guarantees it.
- MUST NOT retry indefinitely.
- MUST NOT drop failed publishes silently.

## SHOULD
- Expose publish latency, error rate, retry count, and record-size metrics.

## Exceptions
Fire-and-forget delivery requires explicit business acceptance of loss risk.

## Verification
Inspect client settings, acknowledgement behavior, retry tests, broker failures, and metrics.