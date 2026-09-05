# Semantic Layer Rules

## Purpose
Provide a governed interface between analytical data models and consuming tools.

## Scope
Applies to semantic models, dimensions, measures, relationships, hierarchies, and governed business entities.

## MUST
- Semantic entities MUST map to documented business concepts and stable grains.
- Measures MUST reference governed metric logic rather than recreate conflicting calculations.
- Relationships MUST define cardinality and join behavior explicitly.
- Changes that alter consumer-visible meaning MUST be impact-assessed and versioned or migrated safely.
- Access controls enforced in the semantic layer MUST align with underlying data permissions.

## MUST NOT
- MUST NOT hide ambiguous many-to-many behavior behind undocumented defaults.
- MUST NOT expose duplicate measures with indistinguishable names and different logic.
- MUST NOT rely on dashboard authors to compensate for incorrect semantic relationships.

## SHOULD
- Centralize reusable dimensions and measures used across multiple analytical products.
- Keep consumer-facing names stable unless clarity requires a managed migration.

## Exceptions
Exceptions require documented use case, consumer scope, risk, and owner approval.

## Verification
Inspect semantic definitions, relationship tests, permission tests, consumer queries, and impact analysis.