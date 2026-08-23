# End-to-End Testing

## Purpose
Protect critical browser workflows using a small, reliable E2E suite that validates integration across frontend, backend, identity, routing, and deployment boundaries.

## When to use
Use for high-value user journeys, release gates, cross-system regressions, and defects that cannot be proven at lower test layers.

## Inputs
Critical journeys, deployed test environment, test accounts/data, API behavior, browser support, and current E2E framework.

## Context to inspect
Selectors, authentication setup, test data lifecycle, network dependencies, retries, screenshots/traces, CI parallelism, and flaky history.

## Core knowledge
E2E tests are expensive and should cover business-critical integration, not duplicate every component case. Deterministic data, stable locators, observable readiness, and useful artifacts are essential.

## Procedure
1. Rank workflows by business and integration risk.
2. Define minimal scenarios that prove each critical path.
3. Create isolated, deterministic test data.
4. Authenticate using a supported stable mechanism.
5. Locate elements by role/label/test contract rather than layout.
6. Wait for observable application states, never fixed sleeps.
7. Capture traces/screenshots/network evidence on failure.
8. Clean up data or use uniquely scoped records.
9. Investigate flaky failures before adding retries.
10. Run representative browsers and CI conditions required by policy.

## Decision points
Keep checks at lower layers when they do not require full-system integration. Use retries only to mitigate known infrastructure noise while a root cause is tracked, never to legitimize flaky application behavior.

## Common failure patterns
Huge suites, shared mutable accounts, fixed delays, brittle selectors, environment dependence, hidden retries, and assertions that do not prove the business outcome.

## Verification
Critical scenarios pass repeatedly from clean state, failure artifacts identify the failing boundary, and deliberate regressions are caught by the expected scenario.

## Expected output
A bounded E2E suite with deterministic setup, stable selectors, actionable diagnostics, and documented coverage.

## Stop conditions
Escalate when the test environment is not representative, test identities/data cannot be safely isolated, or external dependencies make deterministic verification impossible.