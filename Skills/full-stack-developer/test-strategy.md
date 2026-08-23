# Test Strategy

## Purpose
Choose the smallest effective set of automated and manual tests that provides confidence at sustainable cost.

## When to use
New systems, major features, quality problems, slow pipelines, or test-suite redesign.

## Inputs
Architecture, risk profile, change frequency, failure history, release process, existing tests.

## Context to inspect
Unit/integration/E2E coverage, defects, flaky tests, pipeline duration, test data and dependency boundaries.

## Core knowledge
Test behavior at the lowest layer that can prove the risk. Integration tests validate contracts and infrastructure; unit tests isolate complex logic; E2E tests validate a few critical journeys.

## Procedure
1. Identify costly failure modes.
2. Map each risk to an appropriate test layer.
3. Prioritize domain invariants and integration contracts.
4. Define deterministic test-data strategy.
5. Separate fast feedback from broader release checks.
6. Avoid mocking behavior owned by the system under test.
7. Define flaky-test policy.
8. Add security/performance checks where risk warrants.
9. Track suite effectiveness and runtime.
10. Remove redundant tests as architecture evolves.

## Decision points
Favor integration tests when framework/database behavior matters; unit tests for branching domain logic; E2E only when cross-layer proof adds unique value.

## Common failure patterns
Coverage targets as goals, excessive mocks, duplicate tests across layers, testing implementation details, ignored flakes, and slow monolithic suites.

## Verification
Review whether major historical defects would be caught, run suites repeatedly, and measure feedback time and flake rate.

## Expected output
Risk-based testing plan with clear layer responsibilities.

## Stop conditions
Stop when acceptance behavior or critical system boundaries are unknown.