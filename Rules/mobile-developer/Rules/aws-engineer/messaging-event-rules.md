# Messaging and Event Rules
## Purpose
Make asynchronous AWS integrations resilient to duplicates, delay, retries, and partial failure.
## Scope
SQS, SNS, EventBridge, Kinesis, event routing, retry, ordering, and dead-letter handling.
## MUST
- Document delivery, ordering, retention, retry, and duplicate semantics for every critical event path.
- Make consumers idempotent or provide an equivalent deduplication strategy where duplicates are possible.
- Configure dead-letter or failure handling with ownership and replay procedures.
- Bound retries and backoff to protect downstream systems.
## MUST NOT
- Assume synchronous transaction semantics across asynchronous services.
- Replay failed events into production without validating cause, compatibility, and side effects.
## SHOULD
- Version event contracts and preserve backward compatibility during coordinated migrations.
## Exceptions
Exceptions require failure analysis, reconciliation plan, owner, and approval for material risk.
## Verification
Inspect queue/topic/stream configuration, contract tests, duplicate tests, DLQs, replay runbooks, metrics, and failure alarms.