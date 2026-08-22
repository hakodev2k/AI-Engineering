# Transaction Rules
## Purpose
Preserve consistency while controlling contention and failure scope.
## Scope
Transactions, isolation, atomicity, retries, and distributed boundaries.
## MUST
- Define the consistency boundary and choose isolation behavior deliberately for critical workflows.
- Keep transactions bounded and account for retry behavior and side effects.
- Test concurrency-sensitive invariants under realistic contention.
## MUST NOT
- Hold transactions open across unnecessary network or user interactions.
- Retry non-idempotent transactional workflows blindly.
## SHOULD
- Prefer the weakest isolation level that demonstrably preserves required invariants.
## Exceptions
Stronger locking requires evidence of correctness need and operational impact.
## Verification
Review transaction scopes, lock behavior, concurrency tests, deadlock evidence, and failure recovery.