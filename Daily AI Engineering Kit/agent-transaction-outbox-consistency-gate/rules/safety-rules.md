# Transaction Outbox Safety Rules

## MUST
- Persist the business state change and corresponding outbox record in the same database transaction when atomic delivery is required.
- Use a stable outbox/message identifier across publisher retries.
- Treat broker delivery as at-least-once unless the transport contract proves otherwise; consumers must tolerate duplicate message ids.
- Mark an outbox record processed only after the publish operation has returned its required acknowledgement.
- Bound retries to the configured maximum or persist retry state with a bounded policy and quarantine/dead-letter terminal state.
- Preserve evidence for failed publish attempts without storing secrets in `last_error` or logs.
- Verify transaction boundaries, publisher behavior, consumer idempotency, and retry bounds before status can become `verified`.

## MUST NOT
- Publish an integration event before the database transaction containing the business mutation commits.
- Delete pending outbox rows to hide failures.
- Generate a new logical message id for each retry of the same outbox record.
- Mark a message processed before broker acknowledgement.
- Use infinite retry loops.
- Perform schema changes, destructive SQL, production deployment/configuration, secret changes, or breaking event-contract changes without explicit human approval.
- Claim exactly-once processing solely because an outbox is present.

## SHOULD
- Claim rows with database-supported concurrency control and a lease/lock strategy appropriate to the database.
- Keep publisher batches small and observable.
- Record attempts, next retry time, processed time, and a sanitized last error.
- Add an integration test that simulates failure after business commit but before successful publish, then proves later recovery.
- Add a duplicate-delivery consumer test using the same message id twice.
