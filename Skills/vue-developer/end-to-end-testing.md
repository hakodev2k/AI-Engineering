# End-to-End Testing

## Purpose
Protect critical Vue user journeys with reliable browser-level tests that validate deployed integration behavior.

## When to use
Use for authentication, navigation, high-value transactions, cross-component workflows, and production-like regressions.

## Inputs
Critical journeys, environment, test accounts/data, API behavior, and browser automation tooling.

## Context to inspect
Inspect existing E2E architecture, selectors, data setup, authentication strategy, CI environment, and failure artifacts.

## Core knowledge
E2E tests are expensive and should cover high-value integrated behavior rather than every branch. Deterministic data and stable user-facing selectors reduce flakiness.

## Procedure
1. Select business-critical workflows and failure risks.
2. Define deterministic test data setup and cleanup.
3. Use resilient selectors based on role, label, or explicit test contracts.
4. Avoid arbitrary sleeps; wait for observable conditions.
5. Exercise realistic navigation and permissions.
6. Capture screenshots, traces, console, and network evidence on failure.
7. Isolate tests so order does not matter.
8. Run in CI under production-like build settings.
9. Quarantine only with ownership and repair deadline.

## Decision points
Mock external dependencies only when instability/cost makes real integration unsuitable and contract coverage exists elsewhere. Prefer API setup over slow UI setup when setup itself is not under test.

## Common failure patterns
Fixed sleeps, shared mutable accounts, order dependence, overlong suites, brittle DOM selectors, and retrying flaky tests without root-cause work.

## Verification
Run repeated CI executions, inspect artifacts, and intentionally break protected workflows to prove detection.

## Expected output
A focused, diagnosable E2E suite protecting critical workflows.

## Stop conditions
Stop when safe test data or required environment access is unavailable.