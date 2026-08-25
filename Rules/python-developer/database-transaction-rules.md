# Database and Transaction Rules
## Purpose
Protect data integrity and predictable persistence behavior.
## Scope
Python database clients, ORMs, transactions, and migrations invoked by applications.
## MUST
- Transaction boundaries MUST match the required atomic business operation.
- Queries handling user input MUST use parameterization.
- Connection/session lifetime MUST be explicit and bounded.
## MUST NOT
- MUST NOT perform destructive schema or data operations without approved migration and recovery strategy.
- MUST NOT hide N+1 or unbounded-query risks behind ORM abstractions.
## SHOULD
- Inspect query plans or runtime evidence for material query optimization.
## Exceptions
Non-transactional workflows require documented consistency strategy.
## Verification
Integration tests, query logs/plans, migration review, and failure-injection tests.