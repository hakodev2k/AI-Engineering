# Mutation Design

## Purpose
Design GraphQL mutations as clear business commands with safe retry, authorization, validation, and useful outcome semantics.

## When to use
Use when adding create, update, delete, workflow, or command-style operations.

## Inputs
Business operation, invariants, authorization, concurrency model, side effects, and client retry behavior.

## Context to inspect
Inspect existing mutation naming, input/payload conventions, transaction boundaries, idempotency support, audit requirements, and domain services.

## Core knowledge
Mutations are serialized at the top level by GraphQL execution, but downstream distributed effects are not automatically transactional. A mutation should express business intent rather than expose arbitrary persistence operations.

## Procedure
1. Define the business command and actor.
2. Create a dedicated input object with explicit validation.
3. Authorize the operation and target resource.
4. Define concurrency/precondition behavior.
5. Decide whether an idempotency key is required.
6. Execute domain changes within the smallest valid transaction boundary.
7. Handle external side effects with reliable patterns when needed.
8. Return a payload useful for client reconciliation.
9. Define expected business conflicts separately from internal failures.
10. Test duplicate submissions, stale updates, and partial dependency failure.

## Decision points
Use specific mutations for meaningful domain operations; avoid generic update-any-field APIs when invariants matter. Use optimistic concurrency for common interactive edits and stronger coordination only where conflicts are unacceptable.

## Common failure patterns
CRUD-shaped mutations that bypass invariants, non-idempotent retries, authorization after mutation, giant optional input objects, distributed side effects inside fragile transactions, and returning only booleans.

## Verification
Verify authorization, validation, transactionality, duplicate handling, concurrency conflicts, audit events, and client reconciliation.

## Expected output
A domain-oriented mutation contract with explicit safety and failure behavior.

## Stop conditions
Stop if transaction ownership, side-effect guarantees, or authorization rules are unresolved.