# Outbox Safety Rules

## MUST

- Prove the business write and outbox insert share the intended atomic database transaction before claiming loss prevention.
- Preserve a stable message identifier across retries of the same logical outbox record.
- Treat broker publication as potentially duplicate even when the dispatcher is correct.
- Record publish completion only after the publishing API reports success according to the transport contract.
- Keep failed records retryable or explicitly terminal with preserved failure evidence.
- Bound retry attempts or implement an explicit dead-letter/terminal policy.
- Use a claim/lease/locking strategy that prevents multiple workers from silently owning the same record at the same time.
- Add focused tests for transaction, claim, success, failure, and retry behavior when changing those paths.
- Preserve evidence for every blocking scanner finding.
- Stop before approval-required actions.

## MUST NOT

- Delete or permanently mark a record delivered before publish success is known.
- Generate a new logical message ID on every retry of the same outbox record.
- Assume exactly-once delivery from a normal database-plus-broker outbox.
- Hide duplicate-delivery risk by increasing retry delays without proving behavior.
- Add unbounded retry loops.
- Change event schemas, database schemas, or production settings without explicit approval.
- Run destructive cleanup against production data by default.
- Escalate permissions or bypass transaction/locking controls to make tests pass.

## SHOULD

- Store attempt count, last error summary, and next-attempt timestamp when operationally appropriate.
- Use short database claim transactions and perform network publication outside long-held row locks where the chosen design supports safe ownership.
- Make retention/cleanup a separate, approved policy.
- Prefer deterministic IDs derived from persisted records over transient process state.
- Verify consumer idempotency or document the downstream deduplication contract.
