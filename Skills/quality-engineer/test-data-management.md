# Test Data Management

## Purpose
Provide deterministic, representative, secure test data without creating brittle shared state or privacy risk.

## When to use
Use for automated suites, integration environments, migrations, and complex domain scenarios.

## Inputs
Domain model, data constraints, privacy classification, test scenarios, environment capabilities.

## Context to inspect
Inspect schemas, uniqueness constraints, lifecycle, tenant boundaries, sensitive fields, referential integrity, and parallel execution.

## Core knowledge
Prefer minimal scenario-specific data. Synthetic data is safest; masked production-derived data requires governance. Tests should own their setup and cleanup where practical.

## Procedure
1. Classify required data by scenario and sensitivity.
2. Define deterministic builders or fixtures.
3. Preserve valid domain relationships.
4. Generate unique identities for parallel tests.
5. Control clocks and randomness when reproducibility matters.
6. Establish reset/cleanup strategy.
7. Prevent secrets and personal data leakage.
8. Version data with schema changes.
9. Monitor setup cost and contamination failures.

## Decision points
Use seeded baselines for expensive stable reference data; create per-test transactional data for mutable scenarios.

## Common failure patterns
Shared accounts, hard-coded IDs, production PII copies, order-dependent tests, and cleanup that hides failures.

## Verification
Run suites repeatedly and concurrently; verify isolation, privacy controls, reproducibility, and schema compatibility.

## Expected output
A documented data lifecycle with reusable safe builders and fixtures.

## Stop conditions
Stop when required data would violate privacy/security policy or destructive cleanup could affect shared environments.