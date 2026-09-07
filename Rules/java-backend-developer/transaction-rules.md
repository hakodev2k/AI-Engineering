# Transaction Rules

## Purpose
Preserve atomicity and concurrency correctness while limiting contention and failure amplification.

## Scope
Applies to local database transactions and workflows spanning multiple resources.

## MUST
- Transaction boundaries MUST align with a documented business consistency requirement.
- Isolation assumptions and concurrent update behavior MUST be explicit for contested data.
- Transactions MUST be kept bounded in duration and data scope.
- External network calls inside database transactions MUST be justified because they extend lock and failure exposure.
- Multi-resource workflows MUST define partial-failure, retry, compensation, or reconciliation behavior.

## MUST NOT
- MUST NOT assume application-level checks prevent database races.
- MUST NOT use distributed transactions by default when idempotency, outbox, saga, or reconciliation can satisfy requirements more safely.
- MUST NOT retry non-idempotent transaction bodies blindly.

## SHOULD
- Prefer database constraints and optimistic concurrency where appropriate.
- Document invariants that depend on isolation level or locking.

## Exceptions
Long or strongly serialized transactions require measured contention analysis, business justification, and reviewer approval.

## Verification
Use concurrent integration tests, deadlock/lock metrics, database constraints, transaction tracing, failure injection, and review of isolation and retry configuration.