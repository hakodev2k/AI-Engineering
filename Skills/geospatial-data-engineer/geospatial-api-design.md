# Geospatial API Design

## Purpose
Design geospatial APIs that expose spatial data safely, predictably, and efficiently across query, filtering, pagination, and geometry-serialization concerns.

## When to use
Use when publishing spatial datasets or spatial query capabilities through HTTP or service interfaces.

## Inputs
Consumer use cases, datasets, query patterns, latency budgets, authorization rules, geometry formats, versioning requirements.

## Context to inspect
Inspect existing API conventions, CRS expectations, geometry size, pagination model, filtering syntax, rate limits, and downstream clients.

## Core knowledge
Spatial APIs must bound expensive predicates, define CRS and axis conventions, control geometry complexity, and distinguish search envelopes from exact geometry operations.

## Procedure
1. Define consumer tasks and required spatial predicates.
2. Choose canonical response geometry format and CRS.
3. Bound spatial filters by extent, complexity, and result size.
4. Define pagination and stable ordering.
5. Separate lightweight metadata/list endpoints from heavy geometry retrieval where useful.
6. Specify precision and simplification behavior.
7. Validate authorization before spatial execution.
8. Add caching only where request semantics permit it.
9. Define errors for invalid geometry, CRS, or query complexity.
10. Test representative and adversarial spatial queries.

## Decision points
Prefer server-side spatial filtering when it meaningfully reduces transfer. Offer generalized geometry or tile endpoints for visualization-heavy consumers instead of returning full detail everywhere.

## Common failure patterns
Unbounded polygons, no pagination, ambiguous CRS, returning huge geometries by default, and query parameters that bypass indexes.

## Verification
Verify contract tests, spatial correctness, authorization boundaries, payload size, and p95 latency under realistic queries.

## Expected output
A versioned API contract with bounded spatial semantics and measured behavior.

## Stop conditions
Stop when access controls are undefined, query complexity cannot be bounded, or downstream compatibility requires an unresolved breaking change.