# Test Strategy

## Purpose
Design a risk-based automation strategy that gives fast, trustworthy evidence about product quality without maximizing test count.

## When to use
Use for new products, major features, unstable suites, slow pipelines, or release-quality reviews.

## Inputs
Requirements, architecture, user journeys, defect history, release cadence, environments, current tests, production risks.

## Context to inspect
Identify business-critical flows, service boundaries, failure impact, existing coverage, observability, testability, data dependencies, and CI constraints.

## Core knowledge
Balance unit, component, API, integration, contract, UI, performance, and security checks. Coverage is evidence, not a percentage target. Prefer the lowest test layer that can prove the risk while preserving a smaller set of realistic end-to-end journeys.

## Procedure
1. Map critical user and system risks.
2. Rank risks by likelihood and impact.
3. Define quality gates and evidence required for each risk.
4. Assign each check to the cheapest reliable test layer.
5. Separate deterministic PR checks from slower scheduled suites.
6. Define environments, test data, ownership, retry policy, and failure triage.
7. Add observability needed to diagnose failures.
8. Define release-blocking versus informational checks.
9. Measure runtime, flakiness, escaped defects, and maintenance cost.
10. Revisit strategy when architecture or risk changes.

## Decision points
Choose UI tests only when browser behavior or cross-component integration matters. Prefer API/component tests for business rules. Use contract tests when teams deploy independently.

## Common failure patterns
Automation pyramid by dogma, excessive UI coverage, duplicate checks, weak assertions, production-only validation, shared mutable test data, treating flaky tests as normal.

## Verification
Trace each major risk to explicit evidence; run representative suites; confirm failures are diagnosable and gates match release policy.

## Expected output
A prioritized test matrix, suite boundaries, quality gates, ownership, and measurable health targets.

## Stop conditions
Escalate when acceptance criteria, system boundaries, or risk ownership are unresolved.