# Design System Integration

## Purpose
Integrate reusable UI primitives into Angular while preserving consistency, accessibility, theming, and controlled customization.

## When to use
Use when adopting a component library, building shared UI primitives, or reducing inconsistent feature styling.

## Inputs
Design tokens, component specifications, accessibility requirements, theming rules, and existing UI code.

## Context to inspect
Inspect shared components, CSS architecture, tokens, overlays, forms, responsive behavior, and third-party UI dependencies.

## Core knowledge
A design system is a governed contract, not merely a component folder. Prefer semantic tokens and composable primitives over feature-specific options in shared components.

## Procedure
1. Inventory repeated UI patterns and inconsistencies.
2. Define token ownership and theming boundaries.
3. Wrap third-party primitives only when a stable project abstraction adds value.
4. Keep shared component APIs semantic and minimal.
5. Preserve keyboard, focus, and responsive behavior.
6. Document supported composition patterns.
7. Add visual/component regression coverage where valuable.
8. Establish migration and deprecation rules.

## Decision points
Use library components directly when their contract is acceptable; wrap when project semantics, accessibility, or future replacement justify the abstraction.

## Common failure patterns
Mega-components, arbitrary CSS overrides, duplicated tokens, wrappers with no value, inaccessible custom widgets, and breaking shared APIs casually.

## Verification
Validate representative consumers, themes, accessibility, responsive layouts, and backwards compatibility.

## Expected output
A coherent Angular UI layer with stable reusable contracts.

## Stop conditions
Stop when design ownership or required token/component semantics are unresolved.