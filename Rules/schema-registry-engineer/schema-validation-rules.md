# Schema Validation Rules

## Purpose
Reject malformed or semantically unsafe schemas before they become production contracts.

## Scope
Syntax validation, logical types, defaults, references, constraints, and custom policy checks.

## MUST
- Every schema MUST pass format-specific parser validation before registration.
- Defaults MUST be valid for the declared field type.
- References MUST resolve to approved, immutable schema versions or governed aliases.
- Custom organizational constraints MUST be enforced consistently across registration paths.
- Validation failures MUST return actionable diagnostics without exposing secrets.

## MUST NOT
- MUST NOT allow a privileged manual path to bypass mandatory validation silently.
- MUST NOT accept unresolved references into production.
- MUST NOT treat syntactic validity as sufficient evidence of compatibility or semantic correctness.

## SHOULD
- Validate representative encoded payloads for critical contracts.
- Keep validation rules versioned and tested.

## Exceptions
Temporary validator exceptions require bounded scope, rationale, risk evidence, expiry, and approval.

## Verification
Inspect parser results, policy-engine output, reference resolution tests, payload tests, and exception records.