# Accessibility Rules
## Purpose
Ensure supported mobile experiences remain operable and understandable for users with disabilities.
## Scope
Screen readers, focus, semantics, contrast, text scaling, motion, touch targets, and alternative input.
## MUST
- Interactive controls MUST expose meaningful accessible names, roles, states, and actions.
- Critical content and workflows MUST remain usable with supported text scaling and screen readers.
- Information MUST NOT rely solely on color, sound, gesture, or animation when an accessible alternative is required.
## MUST NOT
- Custom controls MUST NOT remove native accessibility semantics without equivalent replacement.
- Focus order MUST NOT trap or disorient assistive-technology users.
## SHOULD
- Prefer native accessible controls before building custom equivalents.
## Exceptions
Platform limitations require documented impact and the best feasible alternative.
## Verification
Run automated accessibility checks plus manual screen-reader, text-size, focus, contrast, and reduced-motion tests.