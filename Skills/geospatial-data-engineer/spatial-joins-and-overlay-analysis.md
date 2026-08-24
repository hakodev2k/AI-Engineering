# Spatial Joins and Overlay Analysis

## Purpose
Execute and optimize spatial joins, intersections, containment, proximity, and overlay workflows with explicit geometric and statistical correctness.

## When to use
Use for enrichment, allocation, catchment analysis, polygon overlays, proximity matching, and spatial aggregation.

## Inputs
Datasets, CRS, spatial predicates, business rules, expected cardinality, accuracy and performance targets.

## Context to inspect
Inspect geometry validity, CRS consistency, feature density, duplicates, overlapping polygons, boundary semantics, and existing indexes.

## Core knowledge
Spatial predicates have precise semantics: intersects, contains, covers, within, touches, and distance-based predicates are not interchangeable. Overlay operations can multiply features and create slivers.

## Procedure
1. State the business relationship in plain language.
2. Map it to an exact spatial predicate and boundary rule.
3. Normalize CRS and validate geometries.
4. Estimate join cardinality on a sample.
5. Apply bounding-box/index candidate filtering.
6. Execute exact predicates only on candidates.
7. Handle one-to-many matches explicitly.
8. Detect slivers, overlaps, gaps, and duplicate matches.
9. Aggregate only after confirming intended weighting semantics.
10. Benchmark and verify representative edge cases.

## Decision points
Use nearest-neighbor only when distance defines the relationship. Use covers rather than contains when boundary points should match. Simplify only when the accuracy budget allows it.

## Common failure patterns
Cartesian spatial joins, hidden one-to-many multiplication, double counting overlaps, boundary mismatches, and joins across incompatible CRSs.

## Verification
Validate sampled matches visually or against known truth, compare cardinalities, inspect edge cases, and measure execution plans and latency.

## Expected output
A reproducible spatial-relationship workflow with explicit predicate semantics and verified cardinality.

## Stop conditions
Stop when overlap allocation rules are undefined, geometry quality invalidates results, or accuracy requirements conflict with available data.