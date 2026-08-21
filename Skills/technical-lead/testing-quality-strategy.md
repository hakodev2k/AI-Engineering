# Testing and Quality Strategy

## Purpose
Design risk-based quality controls that provide fast feedback and credible release confidence.

## When to use
Use for new systems, fragile products, test-suite redesign, or recurring regression problems.

## Inputs
Architecture, critical workflows, defect history, release process, test suite, environments.

## Context to inspect
Inspect failure cost, component boundaries, external dependencies, test runtime, flakiness, production incidents, and observability.

## Core knowledge
Tests should protect valuable behavior at the cheapest reliable layer. Unit, integration, contract, end-to-end, static analysis, and production checks serve different risks.

## Procedure
1. Rank workflows by impact and change frequency.
2. Map failure risks to suitable test layers.
3. Define contract and integration coverage at boundaries.
4. Keep business logic fast and deterministic where possible.
5. Reserve E2E tests for critical journeys.
6. Establish representative test data.
7. Track flaky and slow tests as defects.
8. Define CI quality gates.
9. Include migration, resilience, and security validation where relevant.
10. Review escaped defects and adjust coverage.

## Decision points
Prefer lower-level tests when they prove the same behavior reliably. Use real dependencies when mocks would hide integration risk.

## Common failure patterns
Coverage-percentage goals, mock-heavy false confidence, enormous E2E suites, ignored flakiness, and missing negative cases.

## Verification
Critical risks map to explicit checks, CI feedback is actionable, and escaped defects decrease or reveal clear gaps.

## Expected output
A practical test strategy with coverage boundaries, quality gates, and ownership.

## Stop conditions
Escalate when required environments, representative data, or dependency access cannot be obtained safely.