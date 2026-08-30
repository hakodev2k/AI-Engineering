# Dimensional Modeling

## Purpose
Design maintainable analytical models that express business processes through conformed dimensions, facts, measures, and grain. This skill prevents ambiguous metrics and brittle reporting structures.

## When to use
Use when creating or refactoring star schemas, marts, semantic-ready tables, or cross-domain analytical models. Do not default to dimensional modeling for operational transaction processing.

## Inputs
Business process definitions, source schemas, reporting questions, metric definitions, data volumes, refresh requirements, and consumer expectations.

## Context to inspect
Existing warehouse conventions, semantic models, source keys, historical requirements, data quality rules, and downstream BI usage.

## Core knowledge
Grain must be declared before facts. Facts should represent measurable events or states. Dimensions provide descriptive context and should be conformed when shared across processes. Degenerate, junk, role-playing, and bridge dimensions are specialized tools, not defaults.

## Procedure
1. Identify the business process and analytical questions.
2. Declare the fact table grain explicitly.
3. Identify dimensions and conformance requirements.
4. Classify measures as additive, semi-additive, or non-additive.
5. Choose surrogate-key and natural-key strategy.
6. Define historical behavior for dimensions.
7. Model many-to-many relationships deliberately.
8. Validate with representative queries.
9. Review performance and storage implications.
10. Document business definitions and ownership.

## Decision points
Prefer star schemas for consumption simplicity. Use snowflaking only when normalization materially improves governance or maintenance. Separate facts when grains differ.

## Common failure patterns
Mixed grain, duplicated measures, non-conformed dimensions, unstable natural keys, hidden many-to-many joins, and dimensions carrying transactional facts.

## Verification
Run reconciliation queries against trusted sources, test metric aggregation at multiple levels, and confirm BI consumers can query without compensating logic.

## Expected output
A reviewed dimensional model with declared grain, keys, measures, history strategy, and documented business semantics.

## Stop conditions
Stop when business definitions conflict, source keys are not understood, or historical requirements are unresolved.