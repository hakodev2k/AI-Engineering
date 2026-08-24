# Geospatial Testing Strategy

## Purpose
Design tests that protect spatial correctness, data contracts, transformations, performance, and regression behavior across geospatial pipelines.

## When to use
Use when building or changing spatial ETL, databases, APIs, analytics, or format conversions.

## Inputs
Requirements, transformations, datasets, known edge cases, acceptance tolerances, production failure history.

## Context to inspect
Inspect geometry operations, CRS transformations, precision rules, topology assumptions, fixtures, and current test coverage.

## Core knowledge
Spatial tests need tolerance-aware assertions, topology checks, invariants, and representative edge cases rather than only exact coordinate equality.

## Procedure
1. Identify correctness invariants for each transformation.
2. Create small deterministic fixtures for known geometry cases.
3. Test invalid, empty, multipart, boundary, antimeridian, and precision-sensitive inputs when relevant.
4. Add CRS and unit tests for transformations and measurements.
5. Add property or invariant tests for reversible operations where appropriate.
6. Test data contracts and schema evolution.
7. Add integration tests against the target spatial engine.
8. Preserve regression fixtures for production defects.
9. Add performance thresholds for critical queries or jobs.
10. Separate expected numerical tolerance from unexplained drift.

## Decision points
Use exact equality only when representation is guaranteed stable. Prefer geometric equivalence and tolerance-based checks for numerical operations.

## Common failure patterns
Snapshot-only tests, exact floating-point coordinate assertions, synthetic data with no edge cases, and tests that validate only row counts.

## Verification
Run unit, integration, and regression suites; confirm known bad cases fail before fixes and pass after them.

## Expected output
A layered test suite with spatial invariants, edge cases, and documented tolerances.

## Stop conditions
Stop when acceptance tolerances are unknown, reference outputs are untrusted, or tests require destructive production access.