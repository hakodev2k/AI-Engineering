# API Integration Testing

## Purpose
Verify API behavior across real application boundaries such as routing, authentication, persistence, serialization, and dependencies.

## When to use
Use for endpoint changes, critical workflows, regressions, and release confidence.

## Inputs
Acceptance criteria, API contract, test environment, data setup, and dependency strategy.

## Context to inspect
Test host, database isolation, identity setup, external-service substitutes, and CI execution.

## Core knowledge
Integration tests should exercise realistic boundaries while remaining deterministic. Prefer real databases when database behavior matters; mock only external boundaries whose behavior is already understood.

## Procedure
1. Select high-value API behaviors.
2. Start a production-like application host.
3. Provision isolated deterministic test data.
4. Exercise authentication and authorization.
5. Test success, validation, conflict, and failure paths.
6. Verify persisted state and side effects.
7. Control external dependencies explicitly.
8. Clean up or isolate data between tests.
9. Run tests in CI with useful diagnostics.

## Decision points
Use containers or ephemeral infrastructure when fidelity outweighs startup cost; use fakes for unstable external systems when contract tests cover the boundary.

## Common failure patterns
Mocking the system under test, shared mutable test data, testing only status codes, and environment-specific assumptions.

## Verification
Tests reliably fail for intentional regressions and pass repeatedly in clean CI runs.

## Expected output
A maintainable integration suite covering critical API boundaries.

## Stop conditions
Stop when required test infrastructure cannot be safely isolated or provisioned.