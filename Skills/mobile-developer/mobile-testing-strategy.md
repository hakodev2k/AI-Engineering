# Mobile Testing Strategy

## Purpose
Build a risk-based test portfolio that catches regressions without making delivery slow or flaky.

## When to use
New apps, test-suite redesign, quality problems, major features.

## Inputs
Architecture, critical journeys, defect history, CI constraints, supported devices.

## Context to inspect
Unit/integration/UI tests, platform dependencies, test data, CI runtime, flaky tests.

## Core knowledge
Test behavior at the cheapest reliable layer. Mobile-specific risk includes lifecycle, permissions, devices, OS versions, networks, and external services.

## Procedure
1. Rank journeys and failure modes by risk.
2. Map each risk to unit, integration, component, UI, or device tests.
3. Keep domain/state tests fast and deterministic.
4. Use integration tests for persistence/network boundaries.
5. Reserve end-to-end UI tests for critical cross-layer journeys.
6. Add lifecycle, permission, offline, and upgrade scenarios.
7. Control test data and external dependencies.
8. Track flakiness and runtime as quality metrics.

## Decision points
Prefer real boundaries when mocks hide integration risk; use fakes when determinism and speed dominate.

## Common failure patterns
UI-test pyramids, mocked-everything tests, sleeps, shared mutable data, no device diversity.

## Verification
Mutation/regression evidence, stable CI, known critical journeys covered.

## Expected output
Risk-to-test matrix and maintainable suite.

## Stop conditions
Escalate when critical environments or testability hooks are unavailable.