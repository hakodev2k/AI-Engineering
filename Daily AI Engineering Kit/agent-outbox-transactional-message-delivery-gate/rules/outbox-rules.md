# Transactional Outbox Rules

## MUST
- Persist the business mutation and corresponding outbox record in the same database transaction when they must succeed or fail together.
- Give every logical message a stable identifier reused across retries.
- Mark an outbox record delivered only after the dispatcher receives success acknowledgement from the transport abstraction.
- Preserve failed records for bounded retry with attempt count and last-error evidence that excludes secrets.
- Use atomic claim, lease, or equivalent concurrency control when multiple dispatchers can select the same pending rows.
- Make expired claims recoverable.
- Prove duplicate handling at the consumer or document it as a blocking risk.
- Preserve ordering requirements explicitly when the domain depends on ordering.
- Keep scanner findings separate from confirmed defects.
- Require independent final verification after implementation.

## MUST NOT
- Publish to an external broker and then commit the business transaction as two uncoordinated steps.
- Delete or mark an outbox row delivered before confirmed send success.
- Generate a new event ID for every retry of the same logical message.
- Retry forever without a bounded policy or escalation state.
- Log message payloads containing secrets or regulated data merely for evidence.
- Run destructive SQL, production replay, broker purge, topic deletion, deployment, force push, or secret changes automatically.
- Weaken idempotency, authentication, authorization, or transport verification to make tests pass.

## SHOULD
- Store immutable event type/version and creation time with the message.
- Use small dispatcher batches and deterministic ordering.
- Separate serialization from transport so tests can simulate acknowledgement and failure.
- Record dispatcher attempts and terminal state transitions in structured logs/metrics.
- Prefer inbox/deduplication tables for consumers with non-idempotent side effects.
- Test process-crash windows before and after send acknowledgement.