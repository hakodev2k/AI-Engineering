# Unit, Integration, and UI Testing

## Purpose
Build an iOS test strategy that protects business behavior, platform integration, and critical user journeys without creating a slow brittle suite.

## When to use
Use when adding features, fixing regressions, refactoring architecture, or improving CI confidence.

## Inputs
Acceptance criteria, architecture seams, failure history, CI budget, supported OS/device matrix.

## Context to inspect
Existing XCTest/Swift Testing suites, test doubles, launch arguments, network fixtures, UI identifiers, flaky-test history.

## Core knowledge
Test at the lowest level that can prove the behavior, then add integration/UI coverage for boundaries that unit tests cannot validate. Determinism requires control of clocks, randomness, network, and persistent state.

## Procedure
1. Identify critical behaviors and risks.
2. Assign each to unit, integration, or UI level.
3. Inject controllable external dependencies where useful.
4. Keep unit tests behavior-focused and fast.
5. Exercise persistence/network/platform adapters with integration tests.
6. Cover only critical end-to-end journeys with UI tests.
7. Reset state deterministically between tests.
8. Capture useful failure artifacts.
9. Quarantine only with an owner and repair plan; do not normalize flakiness.

## Decision points
Prefer real lightweight dependencies when mocks would duplicate implementation assumptions. Use UI tests for system wiring, not exhaustive permutations.

## Common failure patterns
Testing implementation details, sleeps, shared state, excessive mocks, giant UI suites, and retries masking races.

## Verification
Run locally and repeatedly in CI-like conditions; inspect duration, flake rate, and failure diagnostics.

## Expected output
Layered test coverage with deterministic setup and evidence for acceptance criteria/regression risks.

## Stop conditions
Stop when required test environment, credentials, or external sandbox cannot be made safe and deterministic.