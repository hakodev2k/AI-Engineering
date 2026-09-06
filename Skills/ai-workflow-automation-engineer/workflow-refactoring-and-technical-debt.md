# Workflow Refactoring and Technical Debt

## Purpose
Reduce workflow complexity and operational risk without changing intended business behavior or destabilizing production processing.

## When to use
Use when workflows contain duplicated logic, excessive branching, hidden dependencies, hard-coded configuration, vendor lock-in, poor tests, or recurring maintenance incidents.

## Inputs
Current workflow definitions, execution history, tests, incident data, dependency map, change backlog, and business invariants.

## Context to inspect
Inspect duplicated nodes/subflows, dead branches, shared variables, implicit ordering, hard-coded IDs, credential coupling, long scripts, connector-specific logic, and untested recovery paths.

## Core knowledge
Technical debt is costly when it increases change risk, incident frequency, onboarding time, or vendor dependence. Refactoring should preserve externally observable behavior unless a deliberate behavior change is separately approved.

## Procedure
1. Identify concrete maintenance or reliability pain rather than refactoring for aesthetics.
2. Define behavioral invariants and current contracts.
3. Add characterization tests around critical existing behavior.
4. Rank debt by risk, frequency of change, and operational cost.
5. Extract duplicated deterministic logic into reusable modules/subflows.
6. Move environment-specific values into configuration.
7. Isolate vendor-specific adapters from business rules.
8. Simplify branching by making state and decisions explicit.
9. Remove dead paths only after usage evidence.
10. Improve naming, documentation, telemetry, and ownership boundaries.
11. Refactor incrementally with reversible releases.
12. Re-run regression and failure-path tests after each step.

## Decision points
Refactor high-churn/high-risk areas first. Rewrite only when incremental change cannot achieve acceptable safety or maintainability and migration cost is justified. Preserve stable interfaces where consumers depend on them.

## Common failure patterns
Big-bang rewrites, changing behavior during cleanup, deleting undocumented exception handling, abstracting one-off logic prematurely, and ignoring operational telemetry during refactoring.

## Verification
Compare pre/post behavior with characterization tests and production-like fixtures; verify incident-critical telemetry and recovery paths remain intact.

## Expected output
A smaller, clearer, testable workflow structure with documented debt removed, preserved contracts, and measured risk reduction.

## Stop conditions
Stop when current behavior cannot be characterized, undocumented business rules emerge, or the proposed refactor requires an unapproved breaking contract change.