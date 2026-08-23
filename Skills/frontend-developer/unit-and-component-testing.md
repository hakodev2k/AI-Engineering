# Unit and Component Testing

## Purpose
Create fast, durable tests that protect frontend behavior at function and component boundaries without coupling tests to implementation details.

## When to use
Use for business logic, component interactions, regressions, refactoring safety, and reusable UI contracts.

## Inputs
Requirements, component contracts, source code, existing test framework, failure history, and accessibility expectations.

## Context to inspect
Test utilities, mocks, fixtures, selectors, coverage gaps, flaky tests, and current testing conventions.

## Core knowledge
Test observable behavior and contracts rather than private state. Prefer realistic DOM interactions and accessible queries. Mock external boundaries selectively; excessive mocking creates false confidence.

## Procedure
1. Identify behaviors whose failure would matter to users or consumers.
2. Separate pure logic tests from component interaction tests.
3. Render components with realistic inputs/providers.
4. Interact through user-visible controls.
5. Assert outputs, DOM semantics, events, or calls at stable boundaries.
6. Cover loading, empty, error, disabled, and edge states where relevant.
7. Mock network/time/browser boundaries only when needed.
8. Add regression tests that fail before the fix.
9. Remove brittle selectors and timing sleeps.
10. Run tests repeatedly and in CI-equivalent conditions.

## Decision points
Use unit tests for deterministic logic and component tests for rendered behavior. Escalate to integration/E2E tests when confidence depends on multiple real subsystems.

## Common failure patterns
Testing private implementation, snapshot-only coverage, mocking the unit under test, arbitrary sleeps, brittle CSS selectors, and chasing line coverage instead of risk.

## Verification
Tests fail for the intended regression, pass after implementation, remain deterministic across repeated runs, and survive safe refactors without needless rewrites.

## Expected output
Focused behavior tests that provide fast regression protection and clear failure diagnostics.

## Stop conditions
Stop when requirements are contradictory, a test requires unsupported environment capabilities, or reliable verification belongs at a different test layer.