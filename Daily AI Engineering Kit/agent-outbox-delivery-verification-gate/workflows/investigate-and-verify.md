# Investigate and Verify Outbox Delivery

## Trigger
A transactional-outbox event is reported missing, delayed, duplicated, or uncertain.

## Entry conditions
Known environment plus message/correlation ID or a bounded lookup key/time window. Production access must be read-only.

## Inputs
Expected event, identifiers, time window, repository, database/log/trace sources.

## Stages
1. **Context — Delivery Investigator:** locate persistence transaction, outbox state machine, dispatcher, retry policy, broker adapter, consumer, and idempotency behavior.
2. **Persistence evidence — Delivery Investigator:** capture redacted row metadata and transaction evidence.
3. **Dispatch evidence — Delivery Investigator:** correlate attempts, failures, acknowledgements, retries, and dead-letter state.
4. **Consumer evidence — Delivery Investigator:** correlate receipt and business-processing outcome.
5. **Risk analysis — Delivery Investigator:** assess duplicate and ordering hazards; produce schema-compatible evidence JSON.
6. **Independent verification — Verification Agent:** inspect evidence and run `python scripts/verify_outbox.py <evidence.json>`.
7. **Recovery decision:** if already verified, complete. If inconclusive, report missing evidence. If recovery requires mutation/replay, stop for human approval.

## Checkpoints
After stages 2, 3, and 4, preserve source identifiers and timestamps. Never replace missing evidence with inference.

## Retry rules
Telemetry/tool queries may retry at most 2 times for timeouts or temporary service errors. Preserve the original error. Validation failures, permission failures, contradictory evidence, and business failures are not retryable.

## Failure paths
- No persisted row: stop as `blocked` unless identifier mapping can be proven.
- Persisted but no dispatch attempt: identify dispatcher failure; do not replay automatically.
- Dispatch acknowledged but no consumer observation: inspect retention/dead-letter/consumer telemetry; result remains inconclusive without proof.
- Consumer processed more than once: fail verification and document idempotency defect.
- Permission/environment failure: stop without privilege escalation.

## Approval points
Explicit human approval is mandatory before production replay, deletion, schema/config change, permission elevation, or any action capable of causing another delivery.

## Definition of Done
The exact message identity is established; all three evidence classes exist; duplicate and ordering risks are assessed; deterministic verification exits 0; status is `verified`; or the workflow ends `blocked`/`inconclusive` with preserved evidence and no unsafe mutation.
