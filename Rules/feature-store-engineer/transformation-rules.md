# Feature Transformation Rules

## Purpose
Keep feature computation deterministic, maintainable, reviewable, and semantically correct.

## Scope
SQL, stream processors, Python/Scala transformations, aggregations, encodings, and derived features.

## MUST
- Transformations MUST declare input dependencies and output schema.
- Deterministic features MUST produce the same output for the same versioned inputs.
- Aggregations MUST define window, grouping, null, and late-data behavior.
- Transformations MUST be version controlled and code reviewed.
- Material logic changes MUST include validation against representative historical data.

## MUST NOT
- MUST NOT embed undeclared external state into deterministic feature computation.
- MUST NOT swallow conversion or parsing failures without observable handling.
- MUST NOT change units, scaling, or encoding semantics silently.

## SHOULD
- Prefer composable transformations with clear ownership boundaries.
- Keep expensive transformations measurable and profileable.

## Exceptions
Non-deterministic transformations require documented need, bounded variability, and validation strategy.

## Verification
Review code diffs, deterministic tests, schema checks, historical comparisons, and data profiles.