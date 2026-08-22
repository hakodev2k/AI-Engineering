# Forms and Validation Rules
## Purpose
Prevent invalid submissions and avoid losing user effort on mobile input flows.
## Scope
Forms, field validation, keyboards, formatting, submission, and server validation.
## MUST
- Client validation MUST improve feedback but server-side validation MUST remain authoritative for security and business integrity.
- Validation errors MUST map to actionable fields or form-level guidance without exposing sensitive internals.
- User-entered data SHOULD be preserved across recoverable submission failures and lifecycle transitions where product risk warrants it.
## MUST NOT
- UI formatting MUST NOT change the semantic value without clear rules.
- Disabled submit buttons MUST NOT be the only mechanism enforcing required business validation.
## SHOULD
- Input types, autofill, keyboard actions, and accessibility semantics SHOULD match the data being requested.
## Exceptions
Sensitive fields may intentionally avoid persistence/autofill based on threat model.
## Verification
Test malformed input, locale formats, server rejection, offline submission, rotation/recreation, accessibility, and duplicate taps.