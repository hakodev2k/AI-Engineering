# Semantic Metrics and Aggregation

## Purpose
Ensure displayed metrics preserve business semantics across grouping, filtering, and drill levels.

## When to use
When implementing KPIs, ratios, distinct counts, cohorts, funnels, or metrics reused across visuals.

## Inputs
Metric definitions, fact grain, dimensions, semantic model, filters, time logic.

## Core knowledge
Not every measure is additive. Ratios must usually be recomputed from components; distinct counts are non-additive; snapshots and balances require time-aware aggregation. Filter context can change denominators and cohort membership.

## Procedure
1. Write the metric definition in business terms.
2. Identify fact grain and allowed dimensional joins.
3. Classify aggregation behavior as additive, semi-additive, or non-additive.
4. Define numerator, denominator, exclusions, null behavior, and time window.
5. Specify filter-context behavior and drill invariants.
6. Implement metrics in the authoritative semantic layer where possible.
7. Test totals versus subgroup rollups.
8. Test edge cases: zero denominator, late data, duplicates, missing dimensions.
9. Version material definition changes and communicate compatibility impact.

## Decision points
Prefer centralized semantic definitions for shared metrics; local calculations are acceptable for one-off exploration when clearly scoped. Recompute ratios from components rather than averaging ratios unless mathematically justified.

## Common failure patterns
Average-of-averages; duplicated facts after joins; summing balances; inconsistent denominator filters; metric logic copied into many dashboards.

## Verification
Reconcile against independently computed test cases at total and subgroup levels and confirm filter/drill behavior.

## Expected output
A tested metric contract specifying formula, grain, aggregation, filter semantics, edge cases, and ownership.

## Stop conditions
Stop when business definitions conflict or source grain cannot support the requested metric.