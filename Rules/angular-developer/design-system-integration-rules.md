# Design System Integration Rules

## Purpose
Maintain coherent UI behavior and avoid local divergence from shared design-system contracts.

## Scope
Reusable UI components, tokens, theming, component wrappers, interaction patterns, and visual consistency.

## MUST
- Use approved design-system primitives for shared interaction patterns when they meet the requirement.
- Preserve accessibility, theming, responsive, and behavioral contracts when wrapping or extending primitives.
- Treat changes to widely reused components as high-impact changes requiring consumer analysis.
- Keep product-specific business behavior outside generic design-system primitives.

## MUST NOT
- Fork shared components locally to bypass an inconvenient contract without evaluating upstream improvement.
- Hard-code visual values that should come from supported design tokens when consistency is required.
- Introduce breaking shared-component behavior silently.

## SHOULD
- Prefer composable extension points over growing universal components with many unrelated flags.

## Exceptions
A product-specific component may diverge when the interaction is genuinely unique and the rationale is documented.

## Verification
Review component consumers, visual regression evidence, accessibility tests, theme variants, and public API changes.