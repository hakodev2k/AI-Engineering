# Design System Integration

## Purpose
Integrate and evolve a Vue design system while preserving consistency, accessibility, theming, and stable component contracts.

## When to use
Use for shared UI libraries, product-wide primitives, design-token adoption, or reducing duplicated UI patterns.

## Inputs
Design specifications, tokens, existing components, accessibility requirements, and consumer use cases.

## Context to inspect
Inspect current primitives, CSS strategy, tokens, themes, component APIs, versioning, and visual tests.

## Core knowledge
A design system is a governed contract, not just a component folder. Primitives should encode durable interaction and visual rules while allowing product composition without business-specific coupling.

## Procedure
1. Inventory repeated patterns and existing primitives.
2. Identify canonical tokens and interaction rules.
3. Define component responsibilities and extension points.
4. Implement accessible semantics and states.
5. Keep business rules outside generic primitives.
6. Document props, slots, events, and examples.
7. Add visual/behavior tests for important variants.
8. Plan migration and deprecation for contract changes.
9. Measure adoption and remove duplicate patterns gradually.

## Decision points
Add a shared primitive when behavior/design is repeated and stable; keep feature-local components when semantics are domain-specific. Prefer tokens over arbitrary values for governed visual decisions.

## Common failure patterns
Mega-components with dozens of flags, business logic in primitives, inconsistent tokens, inaccessible custom widgets, breaking changes without migration, and abstraction before patterns stabilize.

## Verification
Check representative consumers, accessibility, themes, responsive states, visual regressions, and backwards compatibility.

## Expected output
A stable reusable UI contract aligned with design and engineering standards.

## Stop conditions
Stop when design behavior is unresolved or a breaking shared contract lacks migration ownership.