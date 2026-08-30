# Transaction and Consistency

## Purpose
Protect correctness across concurrent and distributed database operations.

## Scope
Transactions, isolation levels, locking, optimistic concurrency, distributed workflows, and consistency guarantees.

## MUST
- Transaction boundaries MUST align with business invariants.
- Isolation levels MUST be selected from documented anomaly tolerance, contention, and latency requirements.
- Cross-system workflows MUST define atomicity limits, compensation, idempotency, and recovery behavior.
- Concurrency conflicts MUST be detected or prevented where lost updates or duplicate effects are unacceptable.

## MUST NOT
- MUST NOT assume serializable behavior from weaker isolation.
- MUST NOT hold long transactions across remote calls without explicit design justification.
- MUST NOT use distributed transactions by default where simpler durable coordination is sufficient.

## SHOULD
- Prefer short transactions and explicit conflict handling.
- Consistency guarantees SHOULD be documented in consumer-facing contracts.

## Exceptions
Exceptions require anomaly analysis, evidence, operational risk, and approval.

## Verification
Use concurrency tests, transaction traces, isolation configuration review, failure injection, and invariant checks.