# Mobile Architecture

## Purpose
Design maintainable mobile systems with clear UI, domain, data, and platform boundaries.

## When to use
New apps, major modules, or architecture refactors.

## Inputs
Requirements, repository, platform targets, NFRs, team constraints.

## Context to inspect
Existing navigation, state, networking, persistence, dependency direction, build modules, platform APIs.

## Core knowledge
Architecture should reduce change cost, not maximize layers. Boundaries must reflect volatility, ownership, testability, offline needs, and platform differences.

## Procedure
1. Identify user journeys and quality attributes.
2. Map volatile dependencies and platform-specific code.
3. Define module and dependency boundaries.
4. Separate presentation, domain rules, and infrastructure where useful.
5. Define state ownership and data flow.
6. Define error and cancellation propagation.
7. Plan testing seams and observability.
8. Validate with representative changes before standardizing.

## Decision points
Choose modularity based on scale and ownership; avoid Clean Architecture ceremony when simpler boundaries suffice.

## Common failure patterns
God modules, circular dependencies, UI-owned business rules, abstractions without substitution value, architecture inconsistent with delivery constraints.

## Verification
Build representative features, dependency checks, tests, and change-impact review.

## Expected output
Documented boundaries, dependency rules, state/data flow, and rationale.

## Stop conditions
Escalate when product/platform requirements conflict or restructuring risks unsupported migration.