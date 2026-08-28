# Metric Definition Rules

## Purpose
Keep metrics mathematically correct, comparable, and governed.

## Scope
Applies to KPIs, ratios, rates, counts, cohorts, and derived business measures.

## MUST
- Every production metric MUST define numerator, denominator when applicable, population, exclusions, grain, time window, and null handling.
- Ratios and rates MUST define zero-denominator behavior.
- Metric definitions MUST identify the authoritative source and owner.
- Material changes to a metric formula MUST be impact-assessed before release.

## MUST NOT
- MUST NOT compare metrics computed from incompatible populations or time bases without disclosure.
- MUST NOT silently change historical metric meaning.

## SHOULD
- Frequently reused metrics SHOULD have executable tests using known examples.

## Exceptions
Exceptions require documented reason, affected consumers, validation evidence, and approval from the metric owner.

## Verification
Review metric catalog entries, formulas, sample calculations, regression tests, and change history.