# Transaction Safety Rules

## MUST
- Identify the business atomicity boundary before editing transaction code.
- Record transaction start/commit/rollback and every external side effect in the affected execution path.
- Preserve evidence for every high/critical finding.
- Verify retry behavior when an operation can be delivered or executed more than once.
- Prefer a durable outbox/inbox or idempotent boundary when a database commit and external side effect cannot share one atomic transaction.
- Keep transaction duration as short as correctness permits.
- Run targeted tests and inspect the final diff before `pass`.
- Stop for explicit approval before schema changes, destructive SQL, data deletion, production changes, breaking contracts, irreversible migrations, or deployment.

## MUST NOT
- Hold a database transaction open across slow network calls unless an existing documented design explicitly requires it and evidence shows it is safe.
- Assume an ORM `SaveChanges` makes later external calls atomic with the database.
- Add automatic retries around non-idempotent side effects without duplicate protection.
- Swallow commit/rollback errors or report success after a failed commit.
- Introduce nested/ambient transactions without checking provider and repository behavior.
- Treat scanner heuristics as confirmed defects without source/test evidence.
- Weaken isolation, concurrency checks, unique constraints, or idempotency solely to make tests pass.
- Run destructive or production mutations as part of verification.

## SHOULD
- Reuse existing unit-of-work, outbox, inbox, idempotency, and concurrency patterns.
- Test rollback, duplicate delivery, retry after partial failure, and concurrent execution when relevant.
- Prefer explicit transaction ownership at the orchestration boundary rather than scattered commits.
- Document unavoidable eventual-consistency windows and compensating behavior.
