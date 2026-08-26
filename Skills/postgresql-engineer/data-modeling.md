# PostgreSQL Data Modeling

## Purpose
Design relational models that preserve business invariants, support expected access patterns, and remain evolvable under production load.

## When to use
Use for new schemas, major feature modeling, or review of structurally weak tables. Do not redesign solely for stylistic consistency.

## Inputs
Requirements, existing schema, representative queries, data volumes, retention rules, consistency requirements.

## Context to inspect
Inspect naming conventions, keys, constraints, cardinalities, write/read ratios, tenancy model, and migration tooling before proposing changes.

## Core knowledge
Prefer explicit relational constraints over application-only assumptions. Normalize to remove harmful redundancy, then denormalize only for measured operational reasons. Model identity, optionality, temporal data, ownership, and lifecycle deliberately.

## Procedure
1. Extract entities, invariants, relationships, and lifecycle rules.
2. Identify primary access and mutation patterns.
3. Choose stable primary keys and relationship cardinalities.
4. Normalize attributes and isolate repeating groups.
5. Encode nullability, uniqueness, foreign keys, checks, and defaults.
6. Select PostgreSQL-native types deliberately.
7. Evaluate hot rows, table growth, tenant boundaries, and archival needs.
8. Review indexes separately from logical modeling.
9. Plan backward-compatible migration.
10. Validate with representative queries and data.

## Decision points
Use surrogate keys when domain identity is mutable or cumbersome; natural keys when genuinely stable and compact. Use JSONB for variable document-shaped attributes, not to avoid relational design.

## Common failure patterns
Missing constraints, overloaded nullable columns, unbounded JSONB, mutable natural keys, polymorphic foreign keys without integrity, premature denormalization.

## Verification
Verify DDL, constraint behavior, representative query plans, migration rehearsal, and acceptance criteria. Implementation is not verified until invalid states are demonstrably rejected.

## Expected output
Schema proposal, rationale, constraints, migration implications, and identified risks.

## Stop conditions
Escalate when business invariants are ambiguous, destructive migration is required, or retention/compliance rules are unresolved.