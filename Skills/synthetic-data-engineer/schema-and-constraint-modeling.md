# Schema and Constraint Modeling

## Purpose
Encode structural and semantic invariants that synthetic records must satisfy.

## When to use
For tabular, transactional, event, document, or multimodal datasets with cross-field rules.

## Inputs
Schema, domain rules, keys, ranges, temporal rules, referential constraints, and examples.

## Context to inspect
Inspect source DDL/contracts, validation code, null patterns, units, enums, and downstream assumptions.

## Core knowledge
Schema validity is weaker than semantic validity. Cross-field, temporal, uniqueness, and referential relationships must be modeled explicitly.

## Procedure
1. Inventory fields and types.
2. Define nullability and domain ranges.
3. Model keys and relationships.
4. Encode cross-field invariants.
5. Encode temporal ordering and lifecycle rules.
6. Separate hard constraints from probabilistic tendencies.
7. Build validators independent of the generator.
8. Test valid, invalid, and boundary records.
9. Version constraints with schema changes.

## Decision points
Enforce hard business invariants deterministically; model soft correlations statistically.

## Common failure patterns
Valid JSON but impossible records; broken foreign keys; inconsistent units; impossible timestamps; overconstraining legitimate rare cases.

## Verification
Independent validators reject seeded violations and accept representative real records.

## Expected output
Constraint specification, executable validations, and boundary tests.

## Stop conditions
Stop if authoritative schema semantics conflict or destructive assumptions would be required.