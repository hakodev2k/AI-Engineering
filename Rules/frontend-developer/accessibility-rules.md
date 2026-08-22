# Accessibility Rules
## Purpose
Ensure critical functionality is operable and understandable by users with diverse access needs.
## Scope
Semantics, keyboard interaction, focus, labels, announcements, contrast, motion, and assistive technology.
## MUST
- Interactive controls MUST expose correct semantic role, accessible name, state, and keyboard behavior.
- Critical workflows MUST be usable without a pointing device.
- Focus MUST move predictably for dialogs, navigation changes, validation, and dynamic content.
- Meaning MUST NOT depend only on color, position, or animation.
- Accessibility regressions on critical paths MUST block release unless an approved exception exists.
## MUST NOT
- Native semantics MUST NOT be replaced with custom behavior without equivalent accessibility.
- Automated accessibility checks MUST NOT be treated as complete conformance evidence.
## SHOULD
- Test representative workflows with keyboard and assistive technology in addition to automation.
## Exceptions
Document unmet criteria, affected users, mitigation, owner, approval, and remediation date.
## Verification
Automated scans, keyboard tests, semantic inspection, and manual assistive-technology review.