# Testing Strategy

## Purpose
Choose a balanced test portfolio that protects business behavior and integration boundaries without creating brittle maintenance overhead.

## When to use
New features, legacy stabilization, architecture changes, defect prevention, or slow/flaky test suites.

## Inputs
Risk, architecture, acceptance criteria, integration points, existing tests, CI constraints.

## Context to inspect
Unit/integration/E2E coverage, flaky tests, execution time, production incidents, contract boundaries.

## Core knowledge
Test behavior at the lowest reliable layer; integration tests catch provider/framework realities; E2E tests protect a few critical journeys but are expensive and slower.

## Procedure
1. Identify business-critical behaviors and failure risks.
2. Unit-test pure domain/application rules.
3. Integration-test DB, HTTP pipeline, auth, serialization, and external adapters with realistic substitutes.
4. Use contract tests for integration schemas.
5. Keep E2E coverage focused on high-value journeys.
6. Avoid tests coupled to implementation details.
7. Control time/randomness/external dependencies.
8. Make failing tests diagnostic.
9. Track flakiness and duration.

## Decision points
Prefer integration tests over mocks when framework/provider behavior is central. Mock narrow external interfaces, not your own entire architecture.

## Common failure patterns
100% coverage goals, over-mocking EF/HTTP, brittle exact-log assertions, shared mutable test data, slow E2E-only strategy.

## Verification
CI repeatability, mutation/defect history where available, meaningful failure diagnostics, acceptable suite duration.

## Expected output
Risk-based tests that provide fast confidence.

## Stop conditions
Escalate test environments needing privileged production-like data.