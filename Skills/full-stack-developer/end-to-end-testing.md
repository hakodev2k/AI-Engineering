# End-to-End Testing

## Purpose
Protect critical user journeys across browser, API, persistence, and integration boundaries with maintainable tests.

## When to use
Critical workflows, regression-prone integrations, release gates, and cross-layer behavior that lower-level tests cannot prove.

## Inputs
User journeys, acceptance criteria, environments, test data, authentication flows, external dependencies.

## Context to inspect
Existing test pyramid, selectors, fixtures, environment reset, CI behavior, flaky-test history.

## Core knowledge
E2E tests provide high confidence but are slower and more fragile. Keep them focused on valuable cross-system contracts while moving combinatorial logic to cheaper tests.

## Procedure
1. Rank journeys by business and technical risk.
2. Select minimal representative scenarios.
3. Create deterministic test data and cleanup.
4. Use stable semantic selectors.
5. Synchronize on observable application states, not arbitrary sleeps.
6. Control or explicitly test external dependencies.
7. Capture traces/screenshots/logs on failure.
8. Run independently and in parallel where safe.
9. Quarantine only with owner and remediation deadline.
10. Track duration and flake rate.

## Decision points
Use real integrations when their contract is part of the risk; stubs when determinism and ownership boundaries make them preferable.

## Common failure patterns
Testing every permutation through UI, shared mutable fixtures, fixed sleeps, implementation selectors, hidden retries, and tests that depend on execution order.

## Verification
Repeat suites, randomize order, run in CI, and confirm failures produce actionable evidence.

## Expected output
A small, reliable suite protecting high-value end-to-end behavior.

## Stop conditions
Escalate when environment instability prevents distinguishing product failures from infrastructure failures.