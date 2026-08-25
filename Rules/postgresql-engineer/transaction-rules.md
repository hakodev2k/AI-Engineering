# Transaction Rules
## Purpose
Preserve correctness while controlling contention and failure scope.
## Scope
ACID transactions, isolation, savepoints, retries, and transaction boundaries.
## MUST
- Choose transaction boundaries from business invariants, not convenience.
- Keep transactions bounded and handle serialization/deadlock failures explicitly where applicable.
- Understand the anomaly guarantees of the selected isolation level.
## MUST NOT
- Hold transactions open across user interaction or unnecessary network calls.
- Retry non-idempotent transactions blindly.
## SHOULD
- Keep locks and snapshots as short-lived as correctness permits.
## Exceptions
Long transactions require documented need, monitored impact, and abort criteria.
## Verification
Use concurrency tests, transaction-age monitoring, lock views, failure injection, and code review.