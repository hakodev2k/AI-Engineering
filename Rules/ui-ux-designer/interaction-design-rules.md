# Interaction Design Rules
## Purpose
Make interactions predictable, efficient, recoverable, and understandable.
## Scope
Controls, states, flows, gestures, forms, and feedback.
## MUST
- Define normal, loading, empty, success, validation, error, disabled, and permission states when applicable.
- Make consequences visible before irreversible actions.
- Preserve input across recoverable failures where feasible.
## MUST NOT
- Depend on hidden gestures for critical functionality without an accessible alternative.
- Use deceptive interaction patterns.
## SHOULD
- Prefer familiar platform conventions unless evidence supports divergence.
## Exceptions
Novel interactions require usability evidence and fallback behavior.
## Verification
Review state coverage and test normal, failure, and recovery paths.