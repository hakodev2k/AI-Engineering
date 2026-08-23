# Android Testing Strategy

## Purpose
Create a risk-based Android test portfolio that protects business logic, lifecycle behavior, data contracts, navigation, and critical UI journeys without over-relying on slow end-to-end tests.

## When to use
Use when designing test coverage, adding a feature, reducing flaky tests, or reviewing release confidence.

## Inputs
Requirements, architecture, defect history, critical journeys, platform integrations, CI constraints, device matrix.

## Preconditions
Identify the highest-impact failure modes before choosing test types.

## Context to inspect
Unit tests, coroutine tests, repository/database tests, Compose/UI tests, instrumentation, fakes, mock servers, emulator/device configuration, CI reports.

## Core knowledge
Test scope should follow risk and boundaries. Prefer fast deterministic tests for pure behavior, integration tests for contracts, and device tests only where Android runtime behavior matters.

## Procedure
1. Map acceptance criteria to failure risks.
2. Test domain/state reducers as local unit tests.
3. Test coroutine timing/cancellation with controlled schedulers.
4. Test DAOs and migrations against real Room behavior.
5. Test network parsing and error mapping with a controlled server.
6. Use Compose/UI tests for semantics and user interaction.
7. Add instrumentation for lifecycle, permissions, intents, or platform APIs.
8. Keep test data deterministic and isolate external services.
9. Quarantine no flaky test silently; diagnose root cause.
10. Track coverage by critical behavior, not percentage alone.

## Decision points
Mock at unstable external boundaries; prefer fakes for stateful collaborators. Choose device coverage based on API/OEM risk rather than exhaustive combinations.

## Common failure patterns
Testing implementation details, sleeps in async tests, shared mutable fixtures, excessive mocking, giant end-to-end suites, and ignoring process/lifecycle cases.

## Verification
Run targeted suites repeatedly in CI-like conditions, inspect flaky rate and failure diagnostics, and verify every critical acceptance criterion has meaningful evidence.

## Expected output
Layered test plan, implemented tests, device/API matrix rationale, and stable CI evidence.

## Stop conditions
Escalate when acceptance criteria are untestable, required devices/services are unavailable, or architecture prevents meaningful isolation.