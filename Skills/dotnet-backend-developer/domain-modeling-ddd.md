# Domain Modeling and DDD

## Purpose
Model complex business rules with explicit language, invariants, entities, value objects, aggregates, and bounded contexts when domain complexity justifies it.

## When to use
Rule-heavy domains, ambiguous terminology, frequent business change, or models where CRUD structures leak complexity.

## Inputs
Business rules, workflows, terminology, domain experts, data model, consistency needs.

## Context to inspect
Existing entities/services, invariants, transaction boundaries, duplicated rules, language mismatches.

## Core knowledge
Entities have identity; value objects represent immutable concepts; aggregates protect transactional invariants; bounded contexts allow models to differ by business meaning.

## Procedure
1. Capture ubiquitous language from real requirements.
2. Identify invariants and lifecycle transitions.
3. Model value concepts explicitly.
4. Keep behavior near the rules it protects.
5. Define aggregates by consistency boundary, not object graph convenience.
6. Keep aggregates small.
7. Separate contexts where terminology/rules diverge materially.
8. Use domain events for meaningful completed facts, not every property change.
9. Test invariants directly.

## Decision points
Use rich domain modeling for meaningful complexity; prefer simpler transaction-script/application-service approaches for straightforward CRUD.

## Common failure patterns
Anemic models despite complex rules, giant aggregates, repository per entity, DDD jargon without business meaning, exposing EF persistence concerns throughout domain code.

## Verification
Domain-expert walkthrough, invariant tests, concurrency/transaction checks.

## Expected output
A model that makes important business rules explicit and enforceable.

## Stop conditions
Escalate unresolved domain terminology or ownership conflicts.