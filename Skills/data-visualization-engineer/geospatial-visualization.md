# Geospatial Visualization

## Purpose
Represent location-dependent patterns without introducing geographic, projection, normalization, or area bias.

## When to use
For spatial distribution, regional comparison, routes, service areas, density, or proximity analysis.

## Inputs
Coordinates or geographic keys, CRS, boundaries, measures, population/exposure denominators, spatial precision.

## Core knowledge
Maps are justified when location is analytically meaningful. Choropleths should usually encode normalized rates rather than raw counts. Projection, boundary vintage, geocoding precision, and overlapping marks can change interpretation.

## Procedure
1. Confirm why geography matters to the decision.
2. Validate geographic keys, coordinate reference systems, and boundary versions.
3. Decide between points, proportional symbols, choropleths, density surfaces, flows, or non-map alternatives.
4. Normalize counts by an appropriate denominator when comparing areas.
5. Select projection and viewport appropriate to geography.
6. Handle overlap through aggregation, clustering, transparency, or scale-dependent rendering.
7. Protect sensitive locations through aggregation or masking.
8. Define legend, classification, and missing-region treatment.
9. Validate extreme regions and boundary joins.

## Decision points
Prefer a ranked bar chart when geographic shape is irrelevant to comparison. Use equal-area projections when area comparison matters and web Mercator primarily for familiar interactive basemaps.

## Common failure patterns
Raw-count choropleths; unmatched region codes; misleading area perception; exposing sensitive coordinates; excessive basemap detail; arbitrary class breaks.

## Verification
Reconcile region totals, inspect unmatched geographies, verify CRS alignment, and compare map conclusions with a non-spatial tabular or ranked view.

## Expected output
A map specification documenting geometry, projection, normalization, classification, privacy, and validation.

## Stop conditions
Stop when geographic precision violates policy or boundary/key quality makes regional conclusions unreliable.