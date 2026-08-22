# Accessibility Rules

## Purpose
Ensure Vue interfaces remain operable and understandable for users with disabilities.

## Scope
Semantic markup, keyboard access, focus, forms, dynamic content, ARIA, contrast, and assistive technology behavior.

## MUST
- Interactive behavior MUST be keyboard operable and expose appropriate semantic roles, names, states, and relationships.
- Form controls MUST have programmatically associated labels and actionable error identification.
- Focus MUST be managed when dialogs, route transitions, or dynamic workflows would otherwise strand or confuse keyboard/screen-reader users.
- Native semantic elements MUST be preferred over recreated controls when they provide required behavior.
- Accessibility regressions in critical user journeys MUST block release until resolved or formally risk-accepted.

## MUST NOT
- Click-only non-interactive elements MUST NOT substitute for buttons or links without equivalent semantics and keyboard behavior.
- ARIA MUST NOT be used to override correct native semantics unnecessarily.
- Automated accessibility scans MUST NOT be treated as complete accessibility validation.

## SHOULD
- Test critical flows with keyboard navigation and representative assistive technology in addition to automation.

## Exceptions
Known limitations require documented impact, workaround where possible, owner, remediation plan, and approval appropriate to severity.

## Verification
Run automated checks, keyboard testing, semantic inspection, focus testing, and manual assistive-technology review for critical flows.