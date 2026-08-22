# Accessibility Rules

## Purpose
Ensure Angular interfaces remain operable and understandable for users with diverse access needs.

## Scope
Semantic HTML, keyboard interaction, focus, forms, dynamic content, ARIA, contrast, and assistive technology behavior.

## MUST
- Use native semantic elements before custom ARIA-based substitutes.
- Ensure all interactive functionality is keyboard operable with visible focus.
- Associate form controls, errors, names, and instructions programmatically.
- Manage focus and announcements for significant dynamic UI changes when users otherwise lose context.

## MUST NOT
- Remove focus indicators without an accessible replacement.
- Use ARIA to override correct native semantics unnecessarily.
- Ship critical flows with known keyboard traps.

## SHOULD
- Include automated accessibility checks plus manual keyboard and screen-reader review for critical journeys.

## Exceptions
A documented accessibility exception requires user impact, alternative access path, owner, approval, and remediation plan.

## Verification
Run automated scanners, keyboard-only tests, semantic inspection, screen-reader checks, and acceptance tests against the project's accessibility target.