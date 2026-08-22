# Transaction and Consistency Rules

## Purpose
Define safe consistency boundaries and prevent accidental distributed transaction assumptions.

## Scope
Applies to transactions, concurrency, eventual consistency, sagas, outbox patterns, and cross-service workflows.

## MUST
- Transaction boundaries MUST align with authoritative data ownership and business invariants.
- Distributed workflows MUST explicitly define partial failure, retry, compensation, and idempotency behavior.
- Consistency level MUST be chosen from business requirements rather than implementation convenience.
- Concurrency-sensitive operations MUST define conflict detection or serialization behavior.

## MUST NOT
- MUST NOT assume atomicity across independent systems without supported transactional guarantees.
- MUST NOT hide eventual consistency from workflows that require immediate correctness.
- MUST NOT use compensation as a substitute for understanding irreversible side effects.

## SHOULD
- Prefer local ACID transactions within ownership boundaries.
- Prefer outbox/inbox or equivalent patterns when reliable state-plus-message publication is required.

## Exceptions
Stronger distributed coordination may be used when business invariants justify the availability and complexity cost.

## Verification
Review transaction scopes, concurrency tests, failure injection, message delivery tests, and recovery procedures.