# Form and Validation Rules
## Purpose
Protect data quality while giving users clear, recoverable form interactions.
## Scope
Forms, validation, submission, field state, and server validation feedback.
## MUST
- Client validation MUST improve feedback but MUST NOT be treated as a security boundary.
- Server validation errors MUST map to actionable UI feedback when safe and relevant.
- Submission MUST prevent unintended duplicate actions for non-idempotent operations.
- Validation rules shared with external contracts MUST remain consistent with the authoritative contract.
- Critical destructive actions MUST communicate scope and consequence before confirmation.
## MUST NOT
- Invalid user input MUST NOT be silently coerced when coercion changes meaning.
- Form failures MUST NOT erase valid user-entered data without necessity.
## SHOULD
- Validate at the earliest useful point without creating disruptive error noise.
## Exceptions
Intentional normalization requires defined semantics and user-safe behavior.
## Verification
Unit/E2E tests should cover boundary values, server errors, duplicate submit, recovery, and accessibility.