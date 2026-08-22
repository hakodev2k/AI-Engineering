# Accessibility Testing Rules

## Purpose
Ensure critical user journeys are usable by people with diverse access needs.
## Scope
Web, mobile, desktop, documents, and assistive-technology-relevant interfaces.
## MUST
- Validate applicable accessibility requirements for critical flows, including keyboard operation, focus, semantics, labels, contrast, and error communication where relevant.
- Combine automated checks with human inspection for requirements automation cannot prove.
- Report accessibility defects by user impact, not cosmetic preference.
## MUST NOT
- Treat a scanner with zero findings as proof of accessibility.
- Approve inaccessible critical paths solely because mouse interaction works.
## SHOULD
- Test representative assistive technology for high-risk experiences.
## Exceptions
Documented platform limitations require owner, impact, mitigation, and approval.
## Verification
Review automated results, keyboard evidence, semantic inspection, and manual accessibility findings.