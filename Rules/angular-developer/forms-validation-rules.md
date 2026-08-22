# Forms and Validation Rules

## Purpose
Ensure Angular forms represent business input reliably and do not confuse client validation with trusted enforcement.

## Scope
Reactive forms, typed forms, validators, dynamic forms, error presentation, and submission state.

## MUST
- Model form controls with types and validation rules consistent with the user-visible contract.
- Distinguish client validation for UX from server-side validation required for integrity and security.
- Prevent duplicate submission when the operation cannot safely run concurrently.
- Preserve server validation errors and map them to actionable user feedback.

## MUST NOT
- Trust disabled, hidden, or client-validated fields as authoritative security controls.
- Discard user input silently after recoverable validation or network failure.
- Couple reusable validators to unrelated UI side effects.

## SHOULD
- Keep cross-field business validation explicit and test it independently from template rendering.

## Exceptions
Very small immutable input surfaces may use simpler bindings when validation and ownership remain unambiguous.

## Verification
Test valid/invalid boundaries, server rejection, duplicate submit, dynamic state, accessibility, and error recovery.