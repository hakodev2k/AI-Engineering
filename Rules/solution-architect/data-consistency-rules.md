# Data Consistency Rules

## Purpose
Ensure consistency guarantees match business invariants, failure modes, and distributed-system realities.

## Scope
Covers transactions, concurrency, replication, distributed workflows, event-driven systems, and eventual consistency.

## MUST
- Business invariants MUST define where strong consistency is required and where eventual consistency is acceptable.
- Distributed workflows MUST define compensation, reconciliation, or recovery when atomic transactions are unavailable.
- Concurrency conflicts MUST have an explicit resolution strategy.
- Event-driven state transitions MUST be designed for duplicate, delayed, and out-of-order messages when those conditions are possible.
- Consistency choices MUST state user-visible behavior during propagation delay or partial failure.

## MUST NOT
- MUST NOT use distributed transactions by default without evaluating operational and coupling costs.
- MUST NOT claim consistency guarantees stronger than the underlying systems provide.
- MUST NOT ignore reconciliation for financially or operationally critical asynchronous workflows.

## SHOULD
- Keep strong consistency boundaries as small as business correctness allows.
- Prefer explicit state machines for long-running workflows.

## Exceptions
Low-value derived data may tolerate temporary inconsistency with bounded staleness.

## Verification
Review invariants, transaction boundaries, concurrency tests, duplicate-message tests, failure simulations, reconciliation reports, and state-transition diagrams.