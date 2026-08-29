# Transaction and Consistency Rules

## Purpose
Preserve graph invariants under concurrent reads and writes.

## Scope
Transactions, isolation, locking, retries, optimistic concurrency, and distributed consistency.

## MUST
- Define the atomic boundary for every multi-entity invariant.
- Keep transactions as short as correctness permits.
- Design retryable write operations to be idempotent or safely deduplicated.
- Document consistency assumptions when reads can observe replicas, lag, or eventual convergence.

## MUST NOT
- Split an invariant across independent commits merely for convenience.
- Retry arbitrary failed transactions without classifying the failure and duplicate-write risk.
- Assume relationship updates are race-free because individual statements are atomic.

## SHOULD
- Use database constraints to complement transactional checks.
- Test contention on hot entities and relationships.

## Exceptions
Eventual consistency requires documented convergence behavior, stale-read tolerance, failure handling, and business acceptance.

## Verification
Use concurrent integration tests, fault injection, transaction telemetry, lock/deadlock evidence, and consistency checks. Review retry logic for bounded attempts, backoff, and duplicate effects.