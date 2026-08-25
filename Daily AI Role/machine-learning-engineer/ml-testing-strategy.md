# ML Testing Strategy

## Purpose
Build layered tests for ML code, data, models and serving behavior where exact outputs may be statistical rather than deterministic.

## When to use
Use when productionizing pipelines or strengthening regression protection.

## Inputs
Pipeline code, data contracts, model artifacts, invariants, acceptance metrics and serving API.

## Context to inspect
Failure history, deterministic boundaries, stochastic stages, external dependencies and CI limits.

## Core knowledge
ML requires conventional software tests plus data assertions, property tests, metamorphic tests, statistical regression tests and end-to-end checks.

## Procedure
1. Unit-test deterministic transformations and utilities.
2. Add schema and semantic data tests.
3. Test split/leakage invariants.
4. Use small deterministic training fixtures for pipeline smoke tests.
5. Assert model artifact and schema compatibility.
6. Add metamorphic tests for expected invariances/monotonic behavior.
7. Define statistical tolerances for stochastic metrics.
8. Contract-test serving requests and responses.
9. Run representative end-to-end inference in CI/CD.
10. Maintain regression fixtures from real incidents.

## Decision points
Keep fast deterministic tests in every commit; move expensive statistical and end-to-end suites to appropriate pipeline stages without removing release gates.

## Common failure patterns
Asserting exact stochastic metrics, mocking away critical integrations, no data tests, flaky thresholds and test fixtures unlike production.

## Verification
Introduce known defects and confirm relevant layers fail; measure test stability across repeated runs.

## Expected output
A layered, maintainable ML test suite tied to known risks.

## Stop conditions
Do not promote when critical regression tests are flaky, skipped or unable to exercise production-compatible artifacts.