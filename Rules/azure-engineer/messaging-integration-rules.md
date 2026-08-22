# Messaging and Integration Rules

## Purpose
Make Azure messaging and integration paths resilient, bounded, and observable.

## Scope
Service Bus, Event Grid, Event Hubs, queues, topics, subscriptions, dead-lettering, retries, and event integrations.

## MUST
- Define delivery semantics, ordering needs, idempotency expectations, and failure handling for each integration.
- Bound retries and provide dead-letter or equivalent handling for poison messages where supported.
- Monitor backlog, age, failures, throttling, and dead-letter growth.
- Protect messaging endpoints and credentials with least privilege.
- Define retention and replay implications for event streams.

## MUST NOT
- Assume exactly-once business processing from transport delivery guarantees alone.
- Retry indefinitely without backoff, limits, or failure disposition.
- Delete dead-lettered production messages without investigation or approved disposition.

## SHOULD
- Use correlation identifiers and schema/version governance for shared events.

## Exceptions
Simplified handling requires bounded impact, evidence, and owner approval.

## Verification
Inspect broker configuration, retry policies, DLQs, consumer behavior, schemas, metrics, access assignments, and failure tests.