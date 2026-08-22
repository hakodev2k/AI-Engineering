# Vue Component Architecture

## Purpose
Design maintainable Vue component boundaries that keep presentation, state, and domain behavior understandable as applications grow.

## When to use
Use when introducing features, decomposing large views, reviewing component ownership, or refactoring duplicated UI behavior.

## Inputs
Requirements, existing component tree, routing, state ownership, API contracts, design system, and tests.

## Context to inspect
Inspect current conventions, Vue version, Composition or Options API usage, shared components, stores, composables, and dependency direction before changing structure.

## Core knowledge
Prefer cohesive components with explicit contracts. Keep domain behavior out of generic presentation components. Avoid decomposition based only on line count. Component boundaries affect rendering, testing, reuse, accessibility, and state ownership.

## Procedure
1. Identify user workflows and UI responsibilities.
2. Map state and events to their natural owners.
3. Separate feature components from reusable primitives.
4. Define minimal props and emitted events.
5. Move reusable stateful behavior into composables only when reuse or isolation is real.
6. Keep API orchestration at an appropriate feature boundary.
7. Avoid hidden coupling through global state.
8. Implement incrementally.
9. Add behavior-focused tests.
10. Review dependency direction and render behavior.

## Decision points
Choose local state when ownership is local; provide/inject for scoped dependency sharing; a store for cross-feature state with durable coordination needs. Prefer composition over deeply configurable mega-components.

## Common failure patterns
Prop drilling without reassessing ownership, globalizing all state, generic components containing business rules, excessive wrappers, implicit event contracts, and premature abstraction.

## Verification
Verify user behavior, component contracts, tests, accessibility, state isolation, and absence of unintended render or state regressions.

## Expected output
A cohesive component structure with clear ownership, stable contracts, and maintainable dependencies.

## Stop conditions
Stop when requirements or ownership are unresolved, a public component contract requires incompatible change, or architecture changes exceed the approved scope.