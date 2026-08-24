# Messaging Rules

## Purpose
Make asynchronous messaging reliable, replay-safe, and operationally observable.

## Scope
Queues, topics, event streams, commands, events, consumers, and producers.

## MUST
- Message handlers MUST be idempotent or protected by deduplication when redelivery is possible.
- Message schemas MUST be versioned or backward-compatible across producer-consumer deployment windows.
- Poison messages MUST have bounded retry and dead-letter handling.
- Processing success MUST only be acknowledged after required state changes are durably committed.

## MUST NOT
- MUST NOT assume exactly-once delivery unless the full system actually guarantees it.
- MUST NOT publish sensitive data without classification and access controls.
- MUST NOT allow unbounded consumer concurrency to overwhelm dependencies.

## SHOULD
- Correlation identifiers SHOULD propagate through asynchronous flows.
- Consumers SHOULD expose lag, failure, retry, and dead-letter metrics.

## Exceptions
At-most-once processing requires explicit business acceptance of loss risk and evidence that the trade-off is appropriate.

## Verification
Review schemas, replay tests, duplicate-delivery tests, dead-letter behavior, consumer metrics, and failure recovery.