# Faceting and Filtering

## Purpose
Design filters and facets that narrow result sets correctly, remain fast at scale, and preserve user trust through accurate counts and semantics.

## When to use
Use when adding structured search controls, diagnosing incorrect facet counts, or optimizing filter-heavy workloads.

## Inputs
Field schema, query patterns, taxonomy, cardinalities, filter requirements, facet UX, latency targets.

## Context to inspect
Keyword/numeric/date mappings, nested structures, aggregations, post-filter behavior, selected-filter semantics, caching, and cardinality distributions.

## Core knowledge
Filters express hard constraints and should generally not affect relevance scoring unless intentionally converted into preferences. Facet counts depend on aggregation scope and selected-filter semantics. High-cardinality facets can be expensive.

## Procedure
1. Define each filter's exact business semantics.
2. Map values to stable structured fields rather than analyzed text.
3. Distinguish hard filters from ranking preferences.
4. Define AND/OR behavior within and across facets.
5. Specify facet-count behavior when filters are selected.
6. Handle missing, unknown, and multi-valued fields explicitly.
7. Benchmark high-cardinality and nested aggregations.
8. Validate locale/date/unit normalization.
9. Test authorization-sensitive filters for leakage.
10. Monitor latency and facet correctness after deployment.

## Decision points
Use keyword fields for exact categorical filtering; numeric/date types for ranges. Precompute taxonomy fields when query-time hierarchy expansion is too costly.

## Common failure patterns
Filtering analyzed text, ambiguous AND/OR semantics, incorrect counts after selection, high-cardinality explosions, mixing authorization with presentation logic, and treating missing as a real category unintentionally.

## Verification
Compare result sets and counts to source-of-truth queries, test multi-select scenarios, and measure latency at realistic cardinalities.

## Expected output
Filter/facet contract, field mappings, count semantics, performance evidence, security considerations, and test cases.

## Stop conditions
Stop when source values are inconsistent, authorization semantics are unresolved, or required aggregation cost exceeds the latency budget.