# Component Design

## Purpose
Create Angular components with clear responsibilities, stable contracts, predictable rendering, and reusable composition.

## When to use
Use when implementing or reviewing UI components, splitting oversized components, or designing reusable UI primitives.

## Inputs
UX requirements, component code, data contracts, interaction rules, and accessibility requirements.

## Context to inspect
Inspect inputs, outputs, signals, templates, styles, lifecycle hooks, child components, services, and tests.

## Core knowledge
Components should expose small contracts, keep derived state derived, avoid hidden side effects, and separate reusable presentation from feature orchestration when useful.

## Procedure
1. Define the component responsibility and consumer contract.
2. Identify required inputs, emitted events, and owned state.
3. Keep transformations deterministic where possible.
4. Move unrelated orchestration or infrastructure access outward.
5. Prefer composition over configurable mega-components.
6. Design loading, empty, error, and disabled states.
7. Preserve accessibility and keyboard behavior.
8. Add focused tests around observable behavior.

## Decision points
Use a reusable component only when semantics are genuinely shared. Keep feature-specific components local instead of forcing generic APIs.

## Common failure patterns
Too many boolean inputs, duplicated state, direct DOM manipulation, lifecycle-driven synchronization, hidden service dependencies, and components that mix networking, business rules, and rendering.

## Verification
Verify contracts, state transitions, accessibility, change detection behavior, tests, and usage from real consumers.

## Expected output
A cohesive component with explicit contracts and maintainable behavior.

## Stop conditions
Stop when UX behavior is contradictory or a shared contract cannot be defined without product clarification.