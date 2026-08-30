# Data Modeling

## Purpose
Ensure data models preserve business meaning, integrity, and evolvability.

## Scope
Conceptual, logical, and physical models for operational and analytical databases.

## MUST
- Entities, relationships, keys, invariants, and cardinalities MUST reflect documented domain rules.
- Model decisions MUST distinguish authoritative data from derived or cached data.
- Constraints that protect critical invariants MUST be enforced in the database when feasible.
- Denormalization MUST document the consistency mechanism and measurable reason.

## MUST NOT
- MUST NOT encode ambiguous semantics in overloaded columns or undocumented sentinel values.
- MUST NOT duplicate authoritative data without an ownership and synchronization strategy.
- MUST NOT remove integrity constraints solely for implementation convenience.

## SHOULD
- Models SHOULD optimize for clear ownership and predictable evolution before micro-optimization.
- Naming SHOULD remain stable across services and schemas for the same business concept.

## Exceptions
Exceptions require rationale, impacted invariants, compensating controls, migration plan, and reviewer approval.

## Verification
Inspect schema definitions, domain documentation, constraints, migration tests, and representative data-quality checks.