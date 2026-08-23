# Saga Workflows

## Purpose
Coordinate multi-service business workflows without distributed database transactions.

## When to use
Use when a business operation spans independently committed services and requires recovery or compensation.

## Inputs
Workflow steps, invariants, compensations, timeout rules, ownership and audit needs.

## Context to inspect
Service boundaries, existing events/commands, idempotency and failure recovery.

## Core knowledge
Sagas trade atomic isolation for explicit state transitions and compensations. Compensation is business logic, not database rollback.

## Procedure
1. Define workflow states and invariants.
2. Identify irreversible steps.
3. Define commands/events and correlation IDs.
4. Specify timeout and retry behavior.
5. Define valid compensations.
6. Choose orchestration or choreography.
7. Persist progress durably.
8. Test partial failures and repeated messages.

## Decision points
Use orchestration for complex workflows requiring visibility; choreography suits simple, loosely coupled reactions.

## Common failure patterns
Unbounded choreography, unsafe compensation, missing timeout paths and non-idempotent steps.

## Verification
Exercise every partial-failure state and prove deterministic recovery or escalation.

## Expected output
A durable saga state model and recovery plan.

## Stop conditions
Escalate when business owners cannot define acceptable compensation for irreversible effects.