# Metric Definition Rules

## Purpose
Make metrics unambiguous, reproducible, and decision-safe.

## Scope
KPIs, operational metrics, ratios, rates, funnels, cohorts, and dashboard measures.

## MUST
- Define numerator, denominator, population, filters, time semantics, grain, and aggregation behavior.
- Use one governed definition for the same business metric unless a version difference is explicit.
- Document whether a metric is additive, semi-additive, or non-additive.
- Version material metric-definition changes.

## MUST NOT
- MUST NOT silently change filters, inclusion criteria, or denominator logic.
- MUST NOT compare metrics produced by incompatible definitions without qualification.

## SHOULD
- Centralize reusable metric logic where the platform supports governed semantic definitions.

## Exceptions
Experimental metrics may use provisional definitions when clearly labeled and isolated from governed reporting.

## Verification
Compare implementation to the metric specification and validate sample calculations against known cases.