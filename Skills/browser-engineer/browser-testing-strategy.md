# Browser Testing Strategy

## Purpose
Build layered tests that catch browser regressions without creating brittle, slow, or implementation-coupled suites.

## When to use
Use when adding features, fixing bugs, reviewing coverage, or diagnosing flaky browser tests.

## Inputs
Behavior contract, subsystem boundaries, existing test infrastructure, failure history, supported platforms.

## Context to inspect
Unit tests, component tests, browser/integration tests, web-platform tests, pixel tests, performance tests, fuzzers.

## Core knowledge
Different failures require different test levels. Public web behavior should favor interoperable conformance tests; internal invariants belong in focused tests. End-to-end tests are valuable but expensive and flaky when overused.

## Procedure
1. Enumerate observable behavior and internal invariants.
2. Map each risk to the lowest reliable test level.
3. Add standards tests for public platform semantics where applicable.
4. Add focused subsystem tests for edge states.
5. Include failure, cancellation, teardown, and process-crash cases.
6. Avoid timing sleeps; wait on deterministic conditions.
7. Run platform-specific coverage where behavior differs.
8. Measure runtime and flake rate.

## Decision points
Prefer deterministic unit/component tests for internal logic and integration tests only for real boundary behavior. Use pixel tests only for visual output that cannot be asserted semantically.

## Common failure patterns
Sleep-based synchronization; tests coupled to private implementation details; happy-path-only coverage; massive fixtures; silently retrying flaky tests.

## Verification
Tests fail before the fix where practical, pass after it, remain deterministic under repetition, and cover identified risks.

## Expected output
A maintainable test portfolio tied to explicit browser risks.

## Stop conditions
Stop when the required behavior is undefined or test infrastructure cannot reproduce the relevant platform/process configuration.