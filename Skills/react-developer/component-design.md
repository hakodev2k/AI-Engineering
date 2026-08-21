# Component Design

## Purpose
Create React components with clear responsibilities, predictable APIs, and strong reuse without over-generalization.

## When to use
Use for new UI components, refactors, design-system work, or difficult-to-test components.

## Inputs
UX requirements, component consumers, state needs, accessibility constraints, visual variants.

## Preconditions
Understand existing design-system primitives and component conventions.

## Context to inspect
Props, children composition, local state, side effects, styling, tests, accessibility semantics.

## Core knowledge
Favor composition over configuration-heavy APIs. Keep rendering pure, move effects to explicit boundaries, and avoid exposing internal implementation details through props.

## Procedure
1. Define one primary responsibility.
2. Separate controlled and uncontrolled concerns.
3. Design minimal stable props.
4. Prefer semantic children/slots for composition.
5. Extract stateful logic only when reuse or clarity improves.
6. Handle loading, empty, error, and disabled states.
7. Add accessibility behavior.
8. Test public behavior rather than internals.

## Decision points
Extract a component when it has independent meaning, reuse, or complexity—not solely to reduce line count.

## Common failure patterns
Boolean-prop explosions, prop drilling without intent, components coupled to one page, effects embedded in render logic, inaccessible custom controls.

## Verification
Render key variants, test keyboard/screen-reader behavior where relevant, run tests, and verify consumers need no internal knowledge.

## Expected output
Focused components with stable APIs and predictable behavior.

## Stop conditions
Stop if design requirements are contradictory or reusable API requirements are unknown.