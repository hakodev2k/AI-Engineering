# Regression Suite Design

## Purpose
Maintain a regression portfolio that protects high-value behavior without becoming slow, redundant, or untrustworthy.

## When to use
Use when building release regression, reducing oversized suites, or responding to escaped defects.

## Inputs
Risk map, defect history, production usage, existing tests, runtime and flake metrics.

## Context to inspect
Critical journeys, changed areas, integrations, supported platforms, historical escapes, duplicate coverage, and suite execution frequency.

## Core knowledge
Regression is a portfolio-management problem. Tests have value, cost, and decay. Keep coverage aligned to current product risk.

## Procedure
1. Rank behaviors by business and technical risk.
2. Map existing tests to those behaviors.
3. Remove exact duplicates and obsolete scenarios.
4. Move checks to cheaper layers where equivalent evidence exists.
5. Keep a small critical-path smoke suite.
6. Maintain broader deterministic regression outside the fastest gate.
7. Add cases for escaped defects at the appropriate layer.
8. Track runtime, flake rate, maintenance churn, and detection value.
9. Review and retire tests as product behavior disappears.

## Decision points
Retain redundant coverage only when different layers catch distinct failure modes. Use change-based selection only when dependency mapping is dependable.

## Common failure patterns
Never deleting tests, UI-heavy regression, duplicate scenarios, obsolete assertions, treating code coverage as regression completeness.

## Verification
Trace critical risks to tests, run the suite repeatedly, sample historical defects, and confirm expected detection with acceptable runtime.

## Expected output
A tiered, risk-aligned regression suite with explicit retention criteria.

## Stop conditions
Escalate when release risk cannot be prioritized or critical behavior lacks a testable interface.