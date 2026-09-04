# Authorization Policy Rules

## Purpose
Ensure access decisions are explicit, least-privileged, testable, and independent from authentication success.

## Scope
Applies to role-based, attribute-based, policy-based, and application authorization controls.

## MUST
- Protected actions MUST require explicit authorization at a trusted enforcement point.
- Authorization policy MUST define subject, resource, action, context, and deny behavior where relevant.
- Privilege changes MUST be auditable and attributable.
- Default behavior for missing or invalid authorization context MUST fail closed unless an approved availability design requires otherwise.
- Policy changes MUST be tested for unintended privilege expansion.

## MUST NOT
- Client-side checks MUST NOT be the sole enforcement mechanism for protected operations.
- Authentication success MUST NOT implicitly grant broad application privileges.
- Authorization rules MUST NOT depend on mutable display names or ambiguous identifiers.

## SHOULD
- Prefer reusable policy constructs with clear ownership over duplicated application-specific privilege logic.
- Sensitive actions SHOULD use step-up or contextual authorization where justified by risk.

## Exceptions
Exceptions require documented business reason, scope, risk, compensating controls, expiry, and approval.

## Verification
Review policy definitions, enforcement points, negative tests, privilege-diff reports, architecture tests, and access telemetry.