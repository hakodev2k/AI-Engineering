# Idempotency Safety Rules

## MUST
- Identify one stable logical operation key before claiming idempotency.
- Verify duplicate handling at the business-effect boundary, not only at handler return values.
- Preserve evidence for retry and duplicate-delivery tests.
- Bound automated retries to two investigative/test reruns unless repository policy is stricter.
- Require explicit approval for schema changes, production configuration/deployment, queue purge, data deletion, breaking contracts, or other irreversible actions.
- Treat external side effects separately from database transaction guarantees.
- Record unresolved risks in the final assessment.

## MUST NOT
- Use a newly generated GUID/UUID per delivery attempt as the logical idempotency key.
- Assume message brokers or job schedulers provide exactly-once business effects.
- Acknowledge/complete a job before required durable state is safely committed unless the design explicitly tolerates loss.
- Purge queues, replay production messages, mutate production data, or change retry policies without approval.
- Hide duplicate effects by weakening assertions or deleting failing evidence.
- Log secrets or full sensitive payloads.

## SHOULD
- Prefer database uniqueness constraints or atomic inbox/outbox records over check-then-insert code.
- Use deterministic provider idempotency keys for external APIs when supported.
- Add reconciliation for external effects whose outcome can be ambiguous after timeouts.
- Test crash windows around commit and acknowledgement boundaries.
- Keep fixes scoped to the affected job and its idempotency boundary.
