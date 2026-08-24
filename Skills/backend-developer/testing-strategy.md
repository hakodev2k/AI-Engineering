# Backend Testing Strategy

## Purpose
Build a risk-based automated test portfolio that catches regressions without making delivery slow or brittle.

## When to use
Use when adding features, restructuring tests, reducing regressions, or reviewing release confidence.

## Inputs
Requirements, architecture, failure history, dependency boundaries, test runtime, deployment risks.

## Context to inspect
Existing unit/integration/contract/E2E tests, fixtures, test data, CI stages, flaky tests, and production incidents.

## Core knowledge
Test pyramid/portfolio trade-offs, behavior-focused tests, integration boundaries, contract testing, deterministic fixtures, test isolation, and mutation/risk thinking.

## Procedure
1. Rank behaviors by business and technical risk.
2. Put fast tests around pure rules and invariants.
3. Use integration tests for database, messaging, serialization, and framework behavior.
4. Add contract tests at external boundaries.
5. Reserve E2E tests for critical journeys.
6. Make test data explicit and isolated.
7. Remove unnecessary mocks of owned implementation details.
8. Track flaky tests and runtime as defects.
9. Ensure CI provides actionable failure evidence.

## Decision points
Mock unstable/unavailable external boundaries; prefer real owned infrastructure in integration tests when practical. Test behavior, not private structure.

## Common failure patterns
100% coverage targets without risk context, excessive mocking, shared mutable fixtures, slow all-E2E suites, ignored flaky tests, and assertions that prove only execution.

## Verification
Introduce representative faults/regressions and confirm the appropriate test layer detects them reliably in CI.

## Expected output
A layered, maintainable test strategy tied to concrete risks.

## Stop conditions
Stop when acceptance criteria are undefined or required integration environments cannot be made safe/deterministic.