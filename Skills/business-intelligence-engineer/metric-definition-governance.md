# Metric Definition Governance

## Purpose
Create durable, auditable metric definitions so dashboards and teams calculate the same business concept consistently.

## When to use
Use when introducing KPIs, resolving conflicting numbers, migrating BI platforms, or centralizing duplicated calculations.

## Inputs
Business definitions, source fields, formulas, owners, dimensions, time semantics, inclusion/exclusion rules, historical examples.

## Context to inspect
Search dashboards, SQL, semantic models, spreadsheets, data catalogs, and stakeholder documentation for competing definitions and hidden exceptions.

## Core knowledge
A production metric needs semantic meaning, formula, grain, dimensional behavior, time basis, ownership, freshness, quality expectations, and versioning. A technically correct formula can still be operationally wrong if cohort, timezone, cancellation, or late-arriving rules differ.

## Procedure
1. State the decision the metric supports.
2. Identify accountable business and technical owners.
3. Inventory current implementations and quantify disagreements.
4. Define numerator, denominator, grain, filters, time basis, dimensions, null behavior, and edge cases.
5. Specify source-of-truth tables and transformation lineage.
6. Create canonical implementation in the governed metric/semantic layer.
7. Build reconciliation cases including boundaries and historical periods.
8. Deprecate duplicate calculations with migration guidance.
9. Version breaking semantic changes and communicate impact.
10. Monitor freshness and data-quality conditions that invalidate interpretation.

## Decision points
Prefer one canonical metric when semantics are identical. Keep separate named metrics when business meanings legitimately differ; do not hide differences behind parameters.

## Common failure patterns
Same label with different formulas, undocumented exclusions, timezone drift, ratio-of-averages errors, mutable historical definitions, and dashboards embedding private metric logic.

## Verification
Compare canonical output with independently calculated reference cases and stakeholder-approved examples. Test dimensional rollups and period boundaries.

## Expected output
A governed metric contract plus canonical implementation, ownership, lineage, tests, and migration notes.

## Stop conditions
Stop when business ownership is absent, definitions remain contradictory, required source history is unavailable, or a semantic change requires governance approval.