# Transaction Rules

## Purpose
Preserve data consistency while avoiding unnecessary locking, contention, and distributed coordination.

## Scope
Database transactions, unit-of-work boundaries, outbox patterns, and state changes spanning resources.

## MUST
- Transaction boundaries MUST align with a clear consistency requirement.
- Multi-step state changes that must be atomic MUST execute within an appropriate transaction or equivalent consistency pattern.
- Transaction isolation level MUST be chosen intentionally for correctness and contention trade-offs.
- External side effects coupled to committed data MUST use a recoverable pattern such as an outbox when atomic cross-resource commit is unavailable.

## MUST NOT
- MUST NOT keep transactions open across slow remote calls without explicit justification.
- MUST NOT assume retries are safe unless the transactional operation is idempotent or otherwise protected.
- MUST NOT claim atomicity across independent systems when no atomic mechanism exists.

## SHOULD
- Transactions SHOULD be as short as correctness allows.
- Concurrency-conflict behavior SHOULD be explicitly tested.

## Exceptions
Long-running or cross-system consistency workflows require documented invariants, compensating actions, failure recovery, and operational monitoring.

## Verification
Review transaction scopes, isolation configuration, concurrency tests, failure injection, outbox processing, and rollback behavior.