# Source Mapping Rules

## Purpose
Keep mappings from source systems to graph semantics explicit and reproducible.

## Scope
Field mappings, transformations, code lists, reference data, normalization, and semantic conversion.

## MUST
- Every production mapping MUST identify its source field, target graph element, transformation logic, and owner.
- Mapping changes MUST be version-controlled and validated against representative source data.
- Units, code systems, and categorical normalizations MUST be explicit.
- Unmapped required values MUST fail visibly or enter a governed exception path.

## MUST NOT
- MUST NOT infer semantic equivalence from similar field names alone.
- MUST NOT silently coerce incompatible source values into valid-looking graph values.
- MUST NOT discard source meaning needed to reverse or audit a transformation.

## SHOULD
- Prefer declarative mappings where they improve traceability and testability.
- Separate source-specific quirks from shared domain semantics.

## Exceptions
Exceptions require documented rationale, affected data, validation evidence, and owner approval.

## Verification
Inspect mapping definitions, transformation tests, sample reconciliations, and source-to-target lineage.