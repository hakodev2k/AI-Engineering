# Code Review and Refactoring

## Purpose
Improve correctness and maintainability through risk-focused review and behavior-preserving structural change.

## When to use
Use for pull requests, legacy hotspots, duplicated logic, unclear boundaries, or technical-debt work.

## Inputs
Change intent, diff, surrounding code, tests, architecture constraints, production risk, static analysis.

## Context to inspect
Callers, tests, data contracts, failure handling, performance/security boundaries, ownership, and recent incident history.

## Core knowledge
Cohesion, coupling, SOLID as heuristics, dependency direction, incremental refactoring, characterization tests, compatibility, and review psychology.

## Procedure
1. Understand requirement and risk before reading implementation details.
2. Check correctness, security, data integrity, failure behavior, and compatibility first.
3. Inspect maintainability and boundary quality second.
4. Distinguish blocking defects from preferences.
5. For refactoring, establish characterization tests where behavior is uncertain.
6. Make small behavior-preserving steps.
7. Re-run relevant tests and static checks after each coherent change.
8. Remove dead abstractions and update documentation where contracts changed.

## Decision points
Refactor now when change risk is reduced materially; defer cosmetic restructuring that expands scope without measurable benefit. Introduce abstractions only around real variation or boundaries.

## Common failure patterns
Style-only reviews, giant rewrites, abstraction for hypothetical reuse, changing behavior during refactor, and approving code without checking failure paths.

## Verification
Confirm acceptance behavior, regression tests, static checks, complexity/dependency improvement, and no unintended contract changes.

## Expected output
Actionable review findings or a smaller, clearer implementation with preserved behavior.

## Stop conditions
Stop refactoring when behavior cannot be characterized safely or scope begins to obscure the original change.