# Transformation Layer Rules

## Purpose
Keep analytical transformation logic modular, deterministic, reviewable, and reusable.

## Scope
Applies to SQL transformations, transformation frameworks, staging models, intermediate models, and marts.

## MUST
- Transformations MUST separate source cleanup, business logic, and presentation concerns when those concerns change independently.
- Business rules MUST be implemented in one authoritative transformation path unless duplication is explicitly justified.
- Transformations MUST be deterministic for the same input state unless nondeterminism is an intentional requirement.
- Dependencies between transformations MUST be explicit and discoverable.
- Materialization strategy MUST be selected based on correctness, freshness, cost, and workload evidence.

## MUST NOT
- MUST NOT embed hidden business-critical logic in ad hoc dashboard queries when it belongs in governed transformations.
- MUST NOT rely on implicit execution order.
- MUST NOT introduce circular dependencies between analytical models.

## SHOULD
- Keep transformations small enough that their grain, inputs, and outputs can be reasoned about independently.
- Prefer reusable intermediate models over repeated complex joins.

## Exceptions
Exceptions require documented reason, operational impact, and tests proving equivalent correctness.

## Verification
Inspect dependency graphs, compiled SQL, model ownership, tests, materializations, and duplicated business expressions.