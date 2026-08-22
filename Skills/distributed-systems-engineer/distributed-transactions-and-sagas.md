# Distributed Transactions and Sagas

## Purpose
Coordinate multi-service business workflows without assuming one ACID transaction can span all participants.

## When to use
Use when a business operation changes independently owned services or stores and partial completion must be managed.

## Inputs
Business workflow, invariants, participant APIs/events, failure modes, reversibility, and audit requirements.

## Context to inspect
Inspect local transaction boundaries, side effects, existing orchestration/choreography, idempotency, compensation capabilities, and ownership.

## Core knowledge
Sagas decompose a distributed transaction into local commits plus forward recovery or compensation. Compensation is a business action, not database rollback, and may itself fail.

## Procedure
1. Define the business invariant and completion states.
2. Break the workflow into independently commit-able steps.
3. Define each step's idempotency and retry semantics.
4. Define compensating or forward-recovery action where required.
5. Choose orchestration or choreography based on coupling and visibility.
6. Persist workflow state durably.
7. Handle duplicate, delayed, and out-of-order events.
8. Define terminal/manual-intervention states.
9. Add audit trail and correlation.
10. Test failures at every step and during compensation.

## Decision points
Prefer a local transaction when ownership can remain within one boundary. Use orchestration when explicit workflow state and centralized policy improve clarity; choreography can reduce central coupling for simpler event reactions.

## Common failure patterns
Calling compensation rollback, assuming every action is reversible, no durable saga state, hidden cycles in choreography, and retrying irreversible steps blindly.

## Verification
Inject failure before and after every local commit and prove the workflow reaches a valid completed, compensated, or explicitly recoverable state.

## Expected output
A durable workflow design with states, retries, compensations, auditability, and recovery procedures.

## Stop conditions
Escalate when business owners cannot define acceptable partial states or irreversible operations lack a recovery policy.