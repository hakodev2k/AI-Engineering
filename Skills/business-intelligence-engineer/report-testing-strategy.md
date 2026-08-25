# Report Testing Strategy

## Purpose
Create layered tests that prove BI reports are semantically correct, secure, interactive, performant, and resilient to change.

## When to use
Use for new reports, major changes, platform migrations, critical KPI dashboards, and regression protection.

## Inputs
Requirements, metric definitions, model, report, security roles, expected values, performance targets, supported clients.

## Context to inspect
Inspect semantic tests, source reconciliation, filters, bookmarks, drill paths, exports, subscriptions, accessibility, and prior defects.

## Core knowledge
Pixel correctness is insufficient. BI testing spans data correctness, calculation semantics, interactions, security, rendering, refresh, and performance. Prefer deterministic value assertions over fragile screenshots when possible.

## Procedure
1. Convert acceptance criteria into testable scenarios.
2. Create small known-value datasets or reference queries for critical measures.
3. Test default state, filters, cross-filtering, drill, sorting, and reset behavior.
4. Validate totals and subtotals separately from detail rows.
5. Execute positive and negative security persona tests.
6. Test empty, null, high-cardinality, and extreme-value states.
7. Validate refresh and stale-data indicators.
8. Measure representative load/query latency.
9. Test exports/subscriptions and accessibility where supported.
10. Automate stable high-value regressions and keep exploratory review for visual semantics.

## Decision points
Automate deterministic, repeatable, high-impact checks; use manual exploratory review for nuanced visual comprehension and rapidly changing prototypes.

## Common failure patterns
Testing only happy paths, trusting source totals without aligned filters, screenshot-only automation, no RLS negative tests, and ignoring subtotal semantics.

## Verification
Maintain evidence linking requirements to passing tests and canonical expected values; rerun after model, source, or security changes.

## Expected output
Risk-based test suite and evidence covering data, calculations, interactions, security, performance, and refresh behavior.

## Stop conditions
Stop when expected values cannot be independently established or required security personas cannot be tested safely.