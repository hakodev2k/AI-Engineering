# Delivery Safety Rules

## MUST
- Business state mutation and outbox enqueue MUST commit atomically when they share a database.
- Every outbound message MUST have a stable event ID and idempotency key before first publish attempt.
- Consumer deduplication MUST use an atomic uniqueness mechanism, not only an in-memory check.
- Consumer side effects and inbox persistence MUST share a transaction where technically possible.
- Dispatch attempts, terminal failures, and relevant timestamps MUST be observable without exposing secrets or sensitive payloads.
- Retry loops MUST be bounded by the configured attempt budget.
- Failed validations MUST preserve evidence sufficient to reproduce the failure.
- External side effects outside the local transaction MUST use provider-supported idempotency or a documented reconciliation mechanism.

## MUST NOT
- Do not delete failed outbox/inbox records merely to unblock processing.
- Do not mark an outbox message delivered before publish acknowledgement is received.
- Do not acknowledge a consumed message before the durable business effect and dedupe record are committed.
- Do not use mutable payload content as the sole deduplication key.
- Do not retry indefinitely.
- Do not replay production messages, truncate inbox/outbox tables, change schemas, or weaken uniqueness constraints without explicit human approval.
- Do not silently broaden broker, database, or cloud permissions.
- Do not log credentials, tokens, connection strings, or unredacted sensitive payloads.

## SHOULD
- Prefer a unique constraint on `(source, event_id)` for inbox deduplication.
- Prefer lease/claim semantics that recover automatically after worker crashes.
- Add jitter to production retry delays while preserving the maximum attempt budget.
- Keep event envelopes versioned and backward compatible.
- Measure outbox age, retry count, poison-message count, and duplicate-consumption count.
- Keep dedupe retention longer than the maximum broker/webhook redelivery window.
