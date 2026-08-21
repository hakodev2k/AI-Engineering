# Automation Architecture

## Purpose
Design maintainable test automation with clear boundaries, reusable abstractions, deterministic execution, and actionable diagnostics.

## When to use
Use when creating or restructuring an automation repository or when maintenance cost and flakiness are growing.

## Inputs
Application architecture, test strategy, frameworks, CI platform, environments, team skills.

## Context to inspect
Existing fixtures, helpers, page/service abstractions, configuration, test data, parallelism, reports, dependencies, and ownership.

## Core knowledge
Separate test intent from transport/UI mechanics. Favor composition, domain-oriented helpers, explicit fixtures, isolated state, dependency boundaries, and observable failures. Avoid abstractions that merely hide framework APIs.

## Procedure
1. Define suite responsibilities and test layers.
2. Establish project/module boundaries.
3. Centralize configuration without global mutable state.
4. Create domain-level actions and assertions where repetition justifies them.
5. Encapsulate volatile selectors/protocol details.
6. Design fixture lifecycle and cleanup.
7. Make parallel execution safe.
8. Standardize logging, screenshots, traces, and failure artifacts.
9. Add linting, typing, review rules, and architecture tests where useful.
10. Measure maintainability and runtime as the suite grows.

## Decision points
Use page objects only when they reduce volatility; use screenplay/domain DSLs only when complexity justifies them. Share utilities across suites only when semantics truly match.

## Common failure patterns
God page objects, inheritance-heavy frameworks, hidden sleeps/retries, global drivers, test-order dependencies, generic helpers with unclear semantics.

## Verification
Run suites in random/parallel order, inspect failure artifacts, make a representative UI/API change, and confirm localized maintenance.

## Expected output
A documented automation structure with clear responsibilities, lifecycle, diagnostics, and extension points.

## Stop conditions
Escalate when application testability requires product-code changes outside QA ownership.