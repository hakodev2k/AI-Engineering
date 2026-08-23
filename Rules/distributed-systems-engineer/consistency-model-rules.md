# Consistency Model Rules

## Purpose
Define and preserve data consistency guarantees across distributed components.

## Scope
Replicated data, caches, asynchronous workflows, and cross-service reads/writes.

## MUST
- Every distributed data flow MUST document its consistency model and user-visible implications.
- Operations requiring linearizable or read-after-write behavior MUST identify the mechanism that provides it.
- Eventual consistency paths MUST define convergence conditions and stale-read tolerance.

## MUST NOT
- MUST NOT imply strong consistency when the system only provides eventual consistency.
- MUST NOT rely on timing assumptions as a consistency guarantee.

## SHOULD
- Prefer the weakest consistency model that safely satisfies business invariants.

## Exceptions
Exceptions require documented invariant impact, compensating controls, and explicit approval for material risk.

## Verification
Review architecture decisions, replica behavior tests, stale-read tests, and failure-mode simulations.