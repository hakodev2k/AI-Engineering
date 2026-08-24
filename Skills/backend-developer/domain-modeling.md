# Domain Modeling

## Purpose
Translate business rules into maintainable backend models with clear invariants, boundaries, and ownership.

## When to use
Use when implementing rule-heavy features, decomposing modules, or correcting persistence-driven designs.

## Inputs
Business requirements, workflows, terminology, existing code, data model, integration boundaries.

## Context to inspect
Read use cases, domain objects, persistence mappings, API contracts, events, tests, and ownership boundaries.

## Core knowledge
Entities, value objects, aggregates, invariants, bounded contexts, domain services, transaction boundaries, and pragmatic DDD.

## Procedure
1. Establish ubiquitous terminology with requirements.
2. Identify invariants and state transitions.
3. Group behavior with the data it governs.
4. Define aggregate boundaries around consistency needs.
5. Separate domain concepts from transport and storage concerns where complexity justifies it.
6. Model cross-boundary interactions explicitly.
7. Add tests around invariants and transitions.
8. Review complexity against actual business value.

## Decision points
Use richer domain models for complex rules; prefer simpler transaction scripts for straightforward CRUD. Keep aggregates small unless atomic consistency requires otherwise.

## Common failure patterns
Anemic models, giant aggregates, persistence annotations driving business design, duplicated rules, ambiguous terminology, and applying DDD ceremony without domain complexity.

## Verification
Demonstrate invariants through tests, trace each model concept to a business rule, and verify transaction boundaries match consistency requirements.

## Expected output
A domain model whose responsibilities, invariants, and boundaries are explicit and testable.

## Stop conditions
Stop when business rules are unresolved, authoritative terminology conflicts, or required consistency spans unknown external systems.