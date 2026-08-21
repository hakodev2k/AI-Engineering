# End-to-End Testing

## Purpose
Protect critical React user journeys across browser, frontend, backend, authentication, and persistence boundaries.

## When to use
Use for checkout, onboarding, permissions, critical CRUD, navigation, and regression-prone workflows.

## Inputs
Critical journeys, environments, test accounts/data, API dependencies, browser matrix.

## Preconditions
Stable test environment and controllable test data are required.

## Context to inspect
E2E framework, selectors, authentication setup, data seeding, retries, screenshots/traces.

## Core knowledge
E2E tests maximize realism but are slower and more failure-prone. Keep them focused on high-value journeys and use stable user-facing locators.

## Procedure
1. Select critical journeys by risk.
2. Create deterministic test data.
3. Use accessible role/label/test-id locators in that order of preference.
4. Avoid arbitrary sleeps; wait on observable conditions.
5. Isolate tests from shared mutable state.
6. Capture traces/screenshots/network evidence on failure.
7. Separate product defects from environment instability.
8. Review flaky tests until root cause is understood.

## Decision points
Use API setup for preconditions when UI setup adds no coverage value.

## Common failure patterns
Shared accounts, fixed sleeps, fragile CSS selectors, retrying away real defects, huge serial workflows.

## Verification
Repeated CI runs, parallel execution checks, and failure diagnostics that identify the broken boundary.

## Expected output
Small, stable, high-value E2E suite.

## Stop conditions
Stop if environment instability prevents trustworthy interpretation of results.