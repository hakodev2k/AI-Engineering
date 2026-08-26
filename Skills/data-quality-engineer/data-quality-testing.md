# Data Quality Testing

## Purpose
Build layered automated tests that protect transformation semantics, contracts, and critical invariants throughout the delivery lifecycle.

## When to use
Use when implementing or changing pipelines, models, contracts, migrations, and quality rules.

## Inputs
Transformation code, schemas, contracts, representative fixtures, known edge cases, production incidents, and acceptance criteria.

## Preconditions
Expected semantics and test boundaries must be explicit.

## Context to inspect
Inspect unit-test conventions, integration environment, source dependencies, deterministic behavior, test data, CI/CD, and production quality checks.

## Core knowledge
Data testing needs multiple layers: transformation unit tests, contract tests, integration tests, reconciliation, and production monitors. Mocks cannot prove behavior of real query engines or serialization boundaries.

## Procedure
1. Identify highest-risk invariants and failure modes.
2. Create minimal deterministic fixtures for transformation logic.
3. Include nulls, duplicates, boundary dates, late data, and invalid domains as relevant.
4. Add schema/contract tests at interfaces.
5. Add integration tests against representative storage/query engines.
6. Add reconciliation for migration or multi-system paths.
7. Convert escaped incidents into regression tests.
8. Keep tests isolated and reproducible.
9. Run fast deterministic tests in CI and expensive checks at appropriate stages.
10. Track flaky tests as defects.

## Decision points
Use synthetic fixtures for precise logic and masked representative data when distribution matters. Avoid exhaustive integration coverage when focused unit tests prove logic more cheaply.

## Common failure patterns
Happy-path-only fixtures; mocks hiding SQL behavior; brittle snapshots of entire datasets; tests without assertions on grain; nondeterministic time-dependent tests; accepting flaky tests.

## Verification
Tests fail on seeded defects, pass on expected edge cases, run reproducibly, and protect prior incident mechanisms.

## Expected output
A layered test suite tied to risks, contracts, transformations, edge cases, and regression history.

## Stop conditions
Stop when test data use violates privacy policy, expected semantics are disputed, or integration testing could modify uncontrolled production resources.