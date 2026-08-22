# End-to-End Testing

## Purpose
Protect critical Angular user journeys with reliable browser-level tests while controlling flakiness and execution cost.

## When to use
Use for high-value workflows spanning routing, browser behavior, frontend-backend integration, or authentication.

## Inputs
Critical journeys, acceptance criteria, test environment, data strategy, and E2E framework.

## Context to inspect
Inspect selectors, fixtures, network dependencies, authentication setup, retries, screenshots/traces, and CI execution.

## Core knowledge
E2E tests provide broad confidence but are slower and more failure-prone. Keep them focused on critical integration behavior and use stable user-facing selectors.

## Procedure
1. Rank journeys by business and regression risk.
2. Define deterministic test data and isolation.
3. Use accessible roles or explicit test identifiers for stable selection.
4. Wait on observable conditions, never arbitrary sleeps.
5. Keep each test independent.
6. Capture traces/screenshots/logs on failure.
7. Quarantine only with an owner and remediation plan.
8. Track flaky-test rate and execution time.

## Decision points
Push detailed edge cases down to cheaper tests. Use real backend integration when contract confidence matters; controlled substitutes may suit rare external dependencies.

## Common failure patterns
Testing every permutation through UI, shared mutable data, brittle CSS selectors, fixed sleeps, hidden retries, and environment coupling.

## Verification
Run repeatedly and in CI; verify deterministic outcomes and useful failure diagnostics.

## Expected output
A small, stable suite covering critical journeys.

## Stop conditions
Stop when environment or test-data isolation cannot provide trustworthy results.