# Geospatial Data Quality

## Purpose
Define and enforce spatial data quality controls covering completeness, positional accuracy, validity, consistency, freshness, and lineage.

## When to use
Use when onboarding datasets, publishing curated layers, changing pipelines, or investigating suspect analytical results.

## Inputs
Data contracts, sample data, authoritative references, quality thresholds, business impact, refresh cadence.

## Context to inspect
Inspect nulls, geometry validity, CRS, bounds, duplicates, temporal freshness, attribute domains, source lineage, and known accuracy limits.

## Core knowledge
Spatial quality is multidimensional: a valid geometry can still be inaccurate, stale, duplicated, or semantically wrong. Quality thresholds must reflect use-case risk.

## Procedure
1. Define measurable quality dimensions and thresholds.
2. Profile source data before transformation.
3. Validate schema and attribute domains.
4. Validate geometry type, validity, bounds, and CRS.
5. Check duplicate and identity rules.
6. Compare positional or thematic accuracy against trusted samples where available.
7. Measure freshness and missing coverage.
8. Quarantine failures with reason codes.
9. Publish quality metrics with dataset versions.
10. Add regression controls for recurring defects.

## Decision points
Reject critical correctness failures; tolerate documented non-critical defects only when consumers understand them. Prefer sampling for expensive accuracy checks and full validation for cheap structural checks.

## Common failure patterns
One generic quality score, silent coercion, thresholds without business rationale, stale reference data, and ignoring spatial coverage gaps.

## Verification
Confirm failed records are detected, thresholds trigger correctly, metrics are reproducible, and known-good samples pass.

## Expected output
A versioned quality contract, metrics, rejected-record evidence, and residual-risk notes.

## Stop conditions
Stop when no acceptable quality threshold exists, reference truth is inadequate, or publishing would conceal material uncertainty.