# Testing Rules

## Purpose
Require evidence that React behavior, critical interactions, and regression-prone paths work as intended.

## Scope
Applies to unit, component, integration, and end-to-end tests.

## MUST
- Tests MUST prioritize externally observable behavior and critical user outcomes.
- Regression fixes MUST include protection that fails before the fix when practical.
- Tests involving async UI MUST wait on observable states rather than arbitrary delays.
- Critical integrations MUST be covered at the boundary where contract failures can be detected.
- Test data and mocks MUST preserve the important semantics of real dependencies.

## MUST NOT
- MUST NOT assert implementation details that make harmless refactoring unnecessarily expensive.
- MUST NOT use arbitrary sleeps as the primary synchronization mechanism.
- MUST NOT accept flaky tests as normal without ownership and remediation.
- MUST NOT mock away the behavior being tested.

## SHOULD
- Prefer component/integration tests for user interactions and focused unit tests for pure logic.
- Prefer a smaller stable E2E suite covering critical journeys.

## Exceptions
Document why deterministic coverage is impractical, residual risk, alternative evidence, and reviewer approval.

## Verification
Run tests repeatedly for flake-sensitive changes, inspect failure quality, review coverage of critical paths, and execute E2E tests in representative environments.