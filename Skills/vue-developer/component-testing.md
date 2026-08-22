# Component Testing

## Purpose
Test Vue components through observable behavior while avoiding tests coupled to implementation details.

## When to use
Use for feature components, reusable UI, regressions, and refactoring safety.

## Inputs
Component contracts, user behavior, dependencies, test framework, and acceptance criteria.

## Context to inspect
Inspect existing Vue Test Utils/testing-library conventions, mocks, global plugins, router/store setup, and test utilities.

## Core knowledge
Tests should assert what users or consumers observe. Mount depth, asynchronous updates, and dependency boundaries affect reliability. Mock only what the test does not intend to verify.

## Procedure
1. Identify critical behaviors and contracts.
2. Render the component with realistic props/providers.
3. Interact through user-visible controls.
4. Await Vue updates and async operations correctly.
5. Assert rendered outcomes and emitted contracts.
6. Cover error, empty, disabled, and boundary states.
7. Avoid selectors tied to incidental markup where possible.
8. Keep mocks minimal and behaviorally accurate.
9. Run tests repeatedly to expose timing dependence.

## Decision points
Use component tests for isolated UI behavior; integration tests when router/store/API collaboration is the subject; E2E for critical full workflows.

## Common failure patterns
Testing internal refs, snapshot-only coverage, excessive mocking, manual nextTick everywhere without understanding async source, brittle CSS selectors, and ignoring accessibility behavior.

## Verification
Confirm tests fail for intentional behavior regressions, pass consistently, and exercise meaningful state transitions.

## Expected output
Fast, stable tests that protect component contracts and user behavior.

## Stop conditions
Stop when requirements are contradictory or a failure belongs to an integration boundary that cannot be represented accurately at component scope.