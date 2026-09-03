# Mutation Safety Rules

## Purpose
Make state-changing GraphQL operations explicit, idempotent where required, and safe under failure and retries.

## Scope
Applies to mutations that create, update, delete, trigger workflows, or invoke external side effects.

## MUST
- Mutations MUST validate authorization and input before side effects begin.
- Mutation boundaries MUST define transaction, idempotency, and retry semantics for externally visible changes.
- Multi-system mutations MUST define compensation or reconciliation when atomicity is impossible.
- Destructive mutations MUST require explicit intent and appropriate authorization.
- Mutation results MUST reflect committed state, not optimistic success before required work completes.

## MUST NOT
- MUST NOT hide irreversible side effects behind fields that appear read-only.
- MUST NOT retry non-idempotent downstream operations blindly.
- MUST NOT return success after partial failure without documented partial-success semantics.

## SHOULD
- SHOULD use client-provided idempotency keys when duplicate execution is materially harmful.
- SHOULD expose stable identifiers for created resources and workflow tracking.

## Exceptions
High-risk destructive or breaking operations require explicit human approval before production execution, with rollback or recovery evidence.

## Verification
Use duplicate-request tests, failure-injection tests, transaction tests, audit review, and end-to-end verification of side effects.