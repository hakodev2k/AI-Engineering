# Accessibility Rules

## Purpose
Ensure React interfaces remain operable and understandable for users with diverse abilities and input methods.

## Scope
Applies to semantic structure, keyboard interaction, focus, forms, dynamic content, and visual state.

## MUST
- Interactive controls MUST be keyboard operable unless the platform inherently prevents it.
- Native semantic elements MUST be used before custom ARIA-based equivalents when they satisfy the behavior.
- Focus movement and restoration MUST be intentional for dialogs, navigation transitions, and dynamic workflows.
- Form controls MUST have programmatically associated labels and accessible error information.
- Meaning conveyed by color MUST have an additional perceivable cue.
- Dynamic status changes that require announcement MUST use an appropriate accessible mechanism.

## MUST NOT
- MUST NOT remove visible focus indication without an equivalent replacement.
- MUST NOT use clickable non-interactive elements as controls without full keyboard and semantic behavior.
- MUST NOT add ARIA attributes that conflict with native semantics.

## SHOULD
- Prefer testing with keyboard navigation and automated accessibility tooling on critical paths.
- Prefer design-system primitives that encode accessibility correctly.

## Exceptions
Any unavoidable accessibility limitation requires documented impact, reason, mitigation, and approval.

## Verification
Use automated accessibility checks, semantic inspection, keyboard testing, focus testing, and screen-reader review for critical workflows.