# Design System Integration

## Purpose
Use and evolve a design system consistently while preventing product code from duplicating visual and interaction primitives.

## When to use
Use when adding UI patterns, wrapping third-party components, or contributing to shared design-system libraries.

## Inputs
Design tokens, component library, UX specs, accessibility standards, theming requirements.

## Preconditions
Inspect existing primitives before creating new ones.

## Context to inspect
Tokens, variants, component APIs, theme provider, styling conventions, visual tests.

## Core knowledge
A design system encodes product decisions, not just CSS. Product-level components should compose primitives rather than fork them casually.

## Procedure
1. Map requirement to existing primitives.
2. Reuse tokens for spacing/color/typography.
3. Compose product-specific components above shared primitives.
4. Add a new primitive only when reuse and semantics justify it.
5. Keep variants bounded and named by intent.
6. Preserve accessibility and theming contracts.
7. Add documentation/examples and tests for shared changes.
8. Check downstream compatibility.

## Decision points
Extend a shared component when behavior is broadly reusable; wrap it locally when semantics are product-specific.

## Common failure patterns
Hard-coded styles, duplicate primitives, massive variant matrices, leaking vendor APIs through product code.

## Verification
Visual regression, accessibility checks, theme variants, and representative consumer tests.

## Expected output
Consistent UI built on stable shared primitives.

## Stop conditions
Stop when design-system ownership or backward-compatibility expectations are unclear.