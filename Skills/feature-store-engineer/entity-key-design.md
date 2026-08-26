# Entity Key Design

## Purpose
Design stable entity identities and joins for reusable feature retrieval without leakage, collisions, or accidental fan-out.

## When to use
Use for new entity types, composite keys, cross-domain joins, or key migrations.

## Inputs
Domain identifiers, source schemas, cardinality, tenancy boundaries, join relationships and privacy constraints.

## Context to inspect
Primary keys, natural identifiers, surrogate IDs, mapping tables, feature views, historical joins and online key serialization.

## Core knowledge
Feature entities need stable identity across time and storage systems. Composite keys must have canonical ordering and encoding. Many-to-many joins can change feature grain and must be explicit.

## Procedure
1. Define the business entity and intended grain.
2. Inventory candidate identifiers and their lifecycle.
3. Test uniqueness, stability, nullability and tenant isolation.
4. Define canonical representation and composite-key encoding.
5. Map source identifiers to the canonical entity.
6. Analyze one-to-one, one-to-many and many-to-many joins.
7. Prevent fan-out with explicit aggregation or bridge logic.
8. Define unknown/deleted entity behavior.
9. Test historical and online lookup equivalence.
10. Document migration strategy for key changes.

## Decision points
Prefer natural keys only when stable and non-sensitive; otherwise use controlled surrogate IDs. Use composite keys when grain genuinely depends on multiple dimensions.

## Common failure patterns
Mutable email-like keys, cross-tenant collisions, delimiter ambiguity, inconsistent normalization, accidental many-to-many joins and orphan mappings.

## Verification
Measure uniqueness, join cardinality, unmatched rates, serialization parity and lookup correctness on historical samples.

## Expected output
A canonical entity-key specification and validated mapping strategy.

## Stop conditions
Stop if identity ownership, tenant boundaries, or key stability cannot be proven.