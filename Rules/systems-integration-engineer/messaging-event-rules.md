# Messaging and Event Rules

## Purpose
Ensure asynchronous integrations remain correct under duplication, reordering, delay, replay, and partial failure.

## Scope
Applies to queues, topics, event buses, webhooks, and event-driven integration flows.

## MUST
- Message schemas, routing keys, ownership, delivery semantics, ordering assumptions, and retention expectations MUST be documented.
- Consumers MUST define duplicate handling and poison-message behavior.
- Events MUST carry enough identity and correlation information for traceability where permitted.
- Producers and consumers MUST tolerate expected asynchronous timing and partial failure.
- Dead-letter or equivalent failure handling MUST have an operational owner.

## MUST NOT
- MUST NOT assume exactly-once delivery unless the end-to-end system demonstrably guarantees it.
- MUST NOT rely on global ordering when the platform guarantees only partition or key ordering.
- MUST NOT discard failed messages without evidence and an explicit retention policy.

## SHOULD
- Event contracts SHOULD favor immutable facts over commands disguised as events.
- Replay behavior SHOULD be tested for stateful consumers.

## Exceptions
Document the delivery assumption, supporting evidence, blast radius, recovery procedure, and approval.

## Verification
Use schema checks, replay tests, duplicate-delivery tests, out-of-order tests, dead-letter inspection, and end-to-end tracing.