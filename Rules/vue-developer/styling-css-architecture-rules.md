# Styling and CSS Architecture Rules

## Purpose
Keep styling predictable, reusable, themeable, and resistant to global regressions.

## Scope
Scoped CSS, CSS modules, utility systems, preprocessors, global styles, tokens, responsive behavior, and theming.

## MUST
- Global styles MUST have an explicit reason and bounded selector scope where possible.
- Shared visual decisions governed by a design system MUST use approved tokens or primitives.
- Component styling MUST account for supported responsive layouts, text expansion, zoom, and interactive states.
- Overrides of third-party or child internals MUST be documented when they depend on unstable implementation details.
- Theme variants MUST preserve required contrast and interaction states.

## MUST NOT
- Broad selectors or `!important` escalation MUST NOT be used routinely to compensate for unclear ownership.
- Styling MUST NOT encode business state solely through color when another perceivable indicator is required.
- Consumers MUST NOT depend on generated Vue scope attributes as a stable public contract.

## SHOULD
- Choose one project-level styling strategy and use exceptions deliberately.
- Keep layout responsibility near the component that owns the layout relationship.

## Exceptions
Targeted global normalization or third-party overrides are acceptable when isolated, documented, and regression-tested.

## Verification
Inspect CSS scope and specificity, run responsive/zoom and theme tests, and use visual regression for shared/high-risk components.