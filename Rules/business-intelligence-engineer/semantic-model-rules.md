# Semantic Model Rules

## Purpose
Provide stable analytical meaning across reports and tools.

## Scope
Applies to semantic layers, reusable measures, dimensions, relationships, and governed analytical models.

## MUST
- Shared business measures MUST be defined once in the governed semantic layer when multiple consumers depend on them.
- Model grain and relationship cardinality MUST be explicit and reviewable.
- Filter propagation behavior MUST be tested for ambiguous or many-to-many paths.
- Breaking semantic changes MUST be versioned or coordinated with affected consumers.

## MUST NOT
- MUST NOT duplicate the same governed metric with divergent formulas across production reports.
- MUST NOT rely on accidental relationship behavior to produce correct totals.

## SHOULD
- Models SHOULD separate reusable business semantics from presentation-specific calculations.

## Exceptions
An exception requires a documented consumer-specific need, impact analysis, and owner approval.

## Verification
Inspect model metadata, measure definitions, relationship diagrams, regression tests, and downstream dependency reports.