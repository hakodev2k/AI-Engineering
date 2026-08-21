# Data and Consistency Decisions

## Purpose
Lead decisions about data ownership, transactions, concurrency, and consistency across system boundaries.

## When to use
Use for workflows spanning databases/services, concurrent updates, migrations, and event-driven processing.

## Inputs
Domain invariants, data model, transaction boundaries, workflows, failure modes, scale requirements.

## Context to inspect
Inspect authoritative stores, writers, isolation behavior, uniqueness rules, message delivery guarantees, and reconciliation paths.

## Core knowledge
Strong consistency has coordination cost; eventual consistency has product and operational cost. Transactions protect bounded invariants, while distributed workflows often need idempotency, durable messaging, and compensation.

## Procedure
1. Identify invariants that must never be violated.
2. Determine authoritative owner for each datum.
3. Map write and read paths.
4. Define required consistency per workflow.
5. Choose transaction boundaries.
6. Define concurrency strategy.
7. For distributed work, define idempotency and durable state transitions.
8. Add reconciliation for recoverable divergence.
9. Test partial failures and duplicate processing.
10. Document user-visible consistency semantics.

## Decision points
Use optimistic concurrency for common low-conflict workflows; stronger coordination when conflicts are frequent or invariants cannot tolerate retries.

## Common failure patterns
Distributed transactions by assumption, dual writes without recovery, last-write-wins data loss, and hidden eventual consistency.

## Verification
Concurrency and failure tests preserve declared invariants, and recovery paths converge correctly.

## Expected output
Explicit ownership, consistency model, transaction boundaries, concurrency handling, and recovery design.

## Stop conditions
Escalate when business owners cannot define acceptable inconsistency or data-loss tolerance.