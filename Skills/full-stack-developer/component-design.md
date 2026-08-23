# Component Design

## Purpose
Create reusable, accessible, testable UI components with clear responsibilities and stable interfaces.

## When to use
Building or refactoring interactive UI and shared component libraries.

## Inputs
Designs, interaction requirements, accessibility expectations, existing components, browser support.

## Context to inspect
Design tokens, component conventions, state ownership, event contracts, tests, accessibility tooling.

## Core knowledge
Good components encapsulate one coherent responsibility, expose semantic APIs, preserve accessibility, and avoid leaking implementation details.

## Procedure
1. Identify behavior and visual variants.
2. Separate domain-specific containers from reusable presentation.
3. Define minimal inputs, outputs, and states.
4. Use semantic HTML first.
5. Define keyboard and focus behavior.
6. Handle loading, empty, error, disabled, and overflow states.
7. Avoid unnecessary internal state.
8. Add focused tests for behavior and accessibility.
9. Verify responsive behavior.
10. Document non-obvious contracts.

## Decision points
Choose composition over configuration when variants become combinatorial. Promote a component to shared scope only after a stable reuse pattern exists.

## Common failure patterns
Boolean-prop explosions, duplicated state, inaccessible custom controls, styling coupled to DOM internals, oversized components, and abstractions created after one use.

## Verification
Test interaction, keyboard navigation, screen-reader semantics, edge states, and representative consuming screens.

## Expected output
A focused component API with implementation and tests.

## Stop conditions
Stop when UX behavior is contradictory or accessibility requirements cannot be determined safely.