# Transaction Rules

## Purpose
Protect data consistency while avoiding unnecessarily broad locking and coupling.

## Scope
Applies to database transactions, unit-of-work boundaries, and workflows spanning multiple resources.

## MUST
- Transaction boundaries MUST align with a clearly defined consistency requirement.
- Operations inside a transaction MUST be kept as short as practical.
- Isolation level MUST be chosen based on required consistency and contention risk.
- External network calls SHOULD occur outside database transactions unless atomicity requirements justify otherwise.
- Retry behavior MUST account for transaction idempotency and database transient-failure semantics.

## MUST NOT
- MUST NOT hold transactions open across user interaction or unbounded external calls.
- MUST NOT assume a database transaction provides atomicity across unrelated external systems.
- MUST NOT swallow deadlock, timeout, or concurrency failures without defined handling.

## SHOULD
- Prefer local transactions plus idempotency/outbox-style coordination for distributed side effects when appropriate.
- Keep transaction ownership in one clear application boundary.

## Exceptions
Long or distributed transaction designs require explicit trade-off analysis, failure model, and approval.

## Verification
Use integration tests, concurrency tests, failure injection, transaction traces, lock/deadlock evidence, and rollback tests.