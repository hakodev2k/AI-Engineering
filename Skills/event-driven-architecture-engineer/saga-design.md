# Saga Design

## Purpose
Coordinate multi-service business transactions without relying on distributed ACID transactions.

## When to use
Use for workflows spanning independently owned transactional resources with compensatable steps.

## Inputs
Business workflow, invariants, participants, compensations, time limits, failure scenarios.

## Context to inspect
Service ownership, event/command contracts, irreversible actions, concurrency, observability, and existing workflow engines.

## Core knowledge
A saga is a sequence of local transactions with explicit recovery. Compensation is semantic undo, not database rollback. Orchestration centralizes flow; choreography distributes reactions.

## Procedure
1. Define the business invariant and completion criteria.
2. Enumerate local transactional steps.
3. Identify irreversible or externally visible effects.
4. Define compensations and their own failure handling.
5. Choose orchestration or choreography based on workflow complexity and ownership.
6. Persist saga state and stable identifiers.
7. Define timeouts, retries, duplicate handling, and concurrency rules.
8. Emit observable lifecycle transitions.
9. Test every failure boundary and compensation path.

## Decision points
Prefer orchestration for long, conditional, auditable workflows; choreography for small loosely coupled reactions. Redesign if compensation cannot restore an acceptable business state.

## Common failure patterns
Treating compensation as exact rollback, hidden central orchestrators, cyclic choreography, no timeout state, duplicate commands, and irreversible steps too early.

## Verification
Fault injection at each step leads to a defined terminal or recoverable state; duplicate and delayed messages do not violate invariants.

## Expected output
A saga state model, contracts, compensation matrix, timeout policy, and tests.

## Stop conditions
Stop when business owners cannot define acceptable compensation or legal/financial effects require stronger guarantees.