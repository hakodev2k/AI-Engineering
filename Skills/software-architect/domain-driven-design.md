# Domain-Driven Design

## Purpose
Use domain modeling to align software structure with business concepts and reduce ambiguity in complex domains.

## When to use
Use when business rules are complex, terminology is inconsistent, or domain boundaries are difficult to maintain.

## Inputs
Business processes, domain language, requirements, existing model, data model, integration contracts, stakeholder knowledge.

## Preconditions
Domain experts or reliable domain evidence must be available.

## Context to inspect
Entities, workflows, invariants, terminology, module ownership, cross-domain dependencies, and existing abstractions.

## Core knowledge
DDD centers on ubiquitous language, bounded contexts, aggregates, entities, value objects, domain services, and explicit context relationships. Tactical patterns are secondary to correct domain boundaries.

## Procedure
1. Identify core business capabilities.
2. Establish ubiquitous language with stakeholders.
3. Separate bounded contexts where models or terminology diverge.
4. Model entities, value objects, invariants, and aggregate boundaries.
5. Keep domain rules independent from infrastructure concerns.
6. Define context integrations explicitly.
7. Validate the model against real workflows and edge cases.
8. Refactor abstractions when the domain understanding changes.

## Decision points
Use rich domain models when behavior and invariants are complex; use simpler transaction scripts when the domain is straightforward. Avoid aggregates larger than the consistency boundary requires.

## Common failure patterns
Database-first domain models, anemic objects for complex rules, giant aggregates, shared models across contexts, and invented abstractions unsupported by domain language.

## Verification
Review representative business scenarios and confirm invariants, terminology, and context boundaries remain coherent.

## Expected output
A domain model and boundary design that reflects business language and isolates conflicting models.

## Stop conditions
Stop when domain rules cannot be validated or conflicting stakeholder definitions remain unresolved.