# Accessibility Testing Rules
## Purpose
Prevent exclusion of users who rely on assistive technologies or alternative interaction modes.
## Scope
User interfaces, documents, keyboard interaction, semantics, focus, contrast, and assistive technology behavior.
## MUST
- Verify applicable accessibility requirements for critical user journeys.
- Include keyboard-only operation, focus behavior, accessible names, semantic structure, and error communication when relevant.
- Record accessibility defects with affected behavior and user impact.
## MUST NOT
- Treat automated accessibility scans as complete accessibility validation.
- Waive critical accessibility failures without accountable risk acceptance.
## SHOULD
- Combine automated checks with manual keyboard and assistive-technology testing.
## Exceptions
Non-applicable criteria must be documented rather than silently omitted.
## Verification
Review scanner output, manual test evidence, requirement mapping, and defect disposition.