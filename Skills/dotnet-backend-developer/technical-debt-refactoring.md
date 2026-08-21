# Technical Debt and Refactoring

## Purpose
Reduce maintainability risk incrementally without mixing uncontrolled redesign into feature delivery.

## When to use
Repeated defects, high change cost, tangled dependencies, obsolete APIs, or fragile modules.

## Inputs
Pain points, change history, defect data, tests, architecture, delivery constraints.

## Context to inspect
Hotspots, duplication, coupling, complexity, dependency graph, incident history, coverage around behavior.

## Core knowledge
Technical debt is a trade-off with carrying cost. Refactoring preserves external behavior while improving structure; large rewrites reset knowledge and create migration risk.

## Procedure
1. Define concrete cost/risk of the debt.
2. Identify smallest boundary that can improve independently.
3. Add characterization tests around important behavior.
4. Separate behavior change from structural change when possible.
5. Refactor in reversible increments.
6. Remove dead abstractions/code.
7. Measure whether change reduces complexity, defects, or delivery friction.
8. Document remaining risk.

## Decision points
Refactor when incremental improvement is feasible; rewrite only when constraints make preservation more expensive/risky than replacement and migration can be staged.

## Common failure patterns
Refactoring without tests, pattern-driven redesign, permanent compatibility layers, giant rewrite branches, treating cosmetic cleanup as high-value debt repayment.

## Verification
Behavioral regression tests, dependency/complexity comparison, change-scenario walkthrough.

## Expected output
Lower-risk structure with preserved behavior and explicit residual debt.

## Stop conditions
Escalate refactors that alter public contracts, schemas, or delivery timelines materially.