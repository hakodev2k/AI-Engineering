# Refactoring and Technical Debt

## Purpose
Manage technical debt as explicit engineering risk and improve design without destabilizing delivery.

## When to use
Use when recurring defects, slow changes, brittle tests, coupling, or obsolete components increase engineering cost.

## Inputs
Codebase, change history, incident data, delivery metrics, dependency graph, roadmap.

## Context to inspect
Inspect hotspots, ownership, test coverage, coupling, runtime criticality, upcoming product changes, and migration constraints.

## Core knowledge
Debt is contextual. Refactoring should target measurable friction or risk, preserve behavior, and usually proceed incrementally behind tests and observability.

## Procedure
1. Identify concrete symptoms and business impact.
2. Locate structural causes and hotspots.
3. Classify debt by risk and change frequency.
4. Define desired design boundaries.
5. Establish regression protection.
6. Choose an incremental migration strategy.
7. Refactor in small reversible steps.
8. Measure whether change cost or risk improves.
9. Remove temporary compatibility paths.
10. Record remaining debt deliberately.

## Decision points
Refactor now when debt blocks imminent work or creates material risk; defer when impact is low and the area is stable. Rewrite only with strong evidence and migration strategy.

## Common failure patterns
Aesthetic refactors, large rewrites, no baseline tests, endless compatibility layers, and debt backlogs without impact.

## Verification
Behavior remains correct, complexity or change friction is reduced, and production signals remain healthy.

## Expected output
A bounded debt-remediation plan and verified incremental improvements.

## Stop conditions
Escalate when safe change requires missing domain knowledge, unavailable tests, or destructive migration approval.