# Transaction Side-Effect Safety Rules

## MUST
- Treat HTTP calls, email/SMS, message publication, blob mutation, and other externally visible I/O inside or adjacent to a database transaction/retry strategy as duplicate-delivery risks until proven otherwise.
- Record file, line, transaction boundary, side effect, retry semantics, and evidence for every finding.
- Prefer commit-then-dispatch through a transactional outbox when database state and an external message must become logically atomic.
- Make consumers idempotent when at-least-once delivery is possible.
- Run existing tests and inspect the final diff after a remediation.
- Require human approval for schema migrations, production configuration, destructive data changes, or changes to public contracts.

## MUST NOT
- Do not claim `SaveChanges` makes an external API/message operation atomic.
- Do not move an external call outside a transaction without checking ordering, failure, and consistency requirements.
- Do not disable EF/database retries merely to hide duplicate side effects without explicit approval and evidence.
- Do not introduce distributed transactions as a default fix.
- Do not execute production writes, migrations, deployments, or secret changes.
- Do not mark a static scanner hit as a confirmed defect without tracing the execution path.

## SHOULD
- Minimize transaction duration.
- Persist an idempotency/deduplication key with outbox work.
- Separate facts, hypotheses, decisions, and unresolved risks.
- Add a failure-injection test that simulates commit/retry boundaries when feasible.