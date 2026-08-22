# Unit and Component Testing

## Purpose
Create fast Angular tests that protect meaningful behavior without coupling excessively to implementation details.

## When to use
Use when implementing components, services, pipes, state logic, or regression fixes.

## Inputs
Acceptance criteria, code, public contracts, failure history, and testing stack.

## Context to inspect
Inspect existing test conventions, TestBed usage, mocks, fixtures, harnesses, and coverage gaps.

## Core knowledge
Test observable behavior and important state transitions. Mock external boundaries, not every collaborator. A test suite should tolerate safe refactoring.

## Procedure
1. Identify behaviors whose failure matters.
2. Choose the smallest useful test boundary.
3. Arrange realistic inputs and minimal doubles.
4. Exercise public interactions rather than private methods.
5. Assert user-visible output, emitted events, state, or boundary calls.
6. Cover errors and edge cases proportional to risk.
7. Keep async tests deterministic.
8. Remove redundant tests that add maintenance without protection.

## Decision points
Use pure unit tests for isolated logic and component tests when template/injection behavior matters. Move cross-system behavior to integration/E2E tests.

## Common failure patterns
Testing private methods, overspecified mocks, giant TestBed setups, snapshot-only confidence, timing sleeps, and chasing coverage percentages.

## Verification
Tests fail for the intended regression, pass after implementation, remain deterministic, and run quickly in CI.

## Expected output
A focused regression-protection suite aligned with behavior.

## Stop conditions
Stop when expected behavior is ambiguous or dependencies cannot be isolated without changing architecture.