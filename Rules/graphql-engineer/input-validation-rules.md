# Input Validation Rules

## Purpose
Reject malformed, unsafe, or semantically invalid GraphQL input before it reaches domain logic.

## Scope
Applies to variables, arguments, input objects, custom scalars, filters, sorting, and mutation payloads.

## MUST
- Structural and semantic validation MUST run before state-changing domain operations.
- Validation MUST enforce domain constraints not expressible in the GraphQL type system.
- Custom scalar parsing MUST reject invalid formats deterministically.
- Filter and sort inputs MUST be constrained to supported fields and operators.
- Validation errors MUST identify actionable client mistakes without exposing internal implementation detail.

## MUST NOT
- MUST NOT interpolate unvalidated input into SQL, search syntax, shell commands, or downstream query languages.
- MUST NOT rely on client-side validation for security or integrity constraints.
- MUST NOT coerce ambiguous invalid values silently when that changes domain meaning.

## SHOULD
- SHOULD centralize reusable validation rules near the owning domain boundary.
- SHOULD test boundary values and adversarial payloads.

## Exceptions
Relaxed validation requires documented compatibility need, risk assessment, and explicit review.

## Verification
Use unit tests, fuzz or property tests where practical, negative integration tests, and security scanner findings.