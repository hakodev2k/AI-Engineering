# Messaging Rules

## Purpose
Preserve correctness and operability in asynchronous message-driven workflows.

## Scope
Applies to queues, topics, event buses, producers, consumers, and message schemas.

## MUST
- Consumers MUST tolerate duplicate delivery unless the transport contract proves otherwise.
- Message schemas MUST have explicit compatibility and evolution rules.
- Acknowledgement/commit behavior MUST align with side-effect durability.
- Poison messages MUST have bounded retry and quarantine/dead-letter handling.
- Ordering assumptions MUST be explicit and limited to guarantees actually provided by the broker and partitioning model.

## MUST NOT
- MUST NOT assume exactly-once business effects solely because a broker advertises exactly-once transport semantics.
- MUST NOT retry indefinitely without visibility and operational escape paths.
- MUST NOT publish sensitive data without classification and access controls appropriate to all subscribers.

## SHOULD
- Use transactional outbox or equivalent patterns when database state and message publication must remain consistent.
- Include stable event identifiers and useful correlation metadata.

## Exceptions
At-most-once handling may be appropriate for explicitly disposable telemetry; document acceptable loss.

## Verification
Use duplicate-delivery tests, redelivery tests, schema compatibility checks, broker failure tests, lag/dead-letter metrics, and end-to-end reconciliation checks.