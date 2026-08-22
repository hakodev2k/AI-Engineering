# Styling and CSS Architecture

## Purpose
Create scalable styling with predictable scope, theming, responsiveness, and minimal specificity conflicts.

## When to use
Use when choosing styling strategy, refactoring CSS, building responsive layouts, or debugging cascade issues.

## Inputs
Design tokens, browser support, component boundaries, theming and SSR requirements.

## Preconditions
Understand the project styling stack and design-system rules.

## Context to inspect
Global CSS, CSS modules/CSS-in-JS/utilities, specificity, tokens, responsive breakpoints, generated CSS size.

## Core knowledge
Prefer local scope and low specificity. Layout should use modern CSS primitives before JavaScript measurements. Styling architecture must work with SSR and runtime performance constraints.

## Procedure
1. Identify global reset/token responsibilities.
2. Keep component styles scoped.
3. Use semantic tokens instead of raw repeated values.
4. Prefer Flexbox/Grid/container/media queries for layout.
5. Define state/variant styles explicitly.
6. Avoid DOM-shape-dependent selectors when possible.
7. Check theme and responsive behavior.
8. Measure runtime/generated CSS cost if tooling injects styles dynamically.

## Decision points
Choose styling technology based on team/tooling/SSR/performance needs, not fashion.

## Common failure patterns
Specificity wars, global leakage, JS-driven layout, hard-coded breakpoints everywhere, inaccessible hidden states.

## Verification
Cross-viewport checks, theme checks, computed-style inspection, and production build validation.

## Expected output
Predictable, maintainable styling with clear scope.

## Stop conditions
Stop if browser-support or design-token requirements are unresolved.