# Visualization Code Review

## Purpose
Review visualization changes for semantic correctness, maintainability, performance, accessibility, and production risk.

## When to use
For pull requests that add or modify charts, dashboards, transformations, metric logic, or interaction behavior.

## Inputs
Change set, requirements, metric contracts, test results, screenshots or preview, performance evidence.

## Core knowledge
Visualization review spans data semantics and UI engineering. A technically clean component is still wrong if aggregation, scales, filtering, or uncertainty are misleading.

## Procedure
1. Read the intended analytical task before inspecting implementation details.
2. Trace changed metrics to authoritative definitions and source grain.
3. Review transformations, joins, aggregation, null handling, and sorting.
4. Inspect chart choice, scales, baselines, labels, and visual hierarchy.
5. Review interaction state, filters, drill paths, and empty/error states.
6. Check accessibility and keyboard behavior.
7. Assess payload, query, and render costs.
8. Review security, export, and sensitive-data implications.
9. Confirm meaningful automated and manual tests.
10. Separate blocking correctness issues from optional style improvements.

## Decision points
Block on semantic errors, misleading encodings, security/accessibility failures, or material regressions. Prefer follow-up work for non-critical polish when risk is low.

## Common failure patterns
Reviewing screenshots only; approving duplicated metric logic; bikeshedding colors while missing wrong grain; no edge-case fixtures; unbounded client transforms.

## Verification
Reproduce critical states locally or in preview and independently validate representative calculations.

## Expected output
Prioritized review findings tied to correctness, risk, evidence, and maintainability.

## Stop conditions
Do not approve when critical metric semantics, authorization behavior, or test evidence remain unresolved.