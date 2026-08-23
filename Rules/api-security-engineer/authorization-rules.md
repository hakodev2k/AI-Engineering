# Authorization Rules

## Purpose
Ensure every protected API operation enforces intended permissions at the correct boundary.

## Scope
Object, function, tenant, role, scope, attribute, and administrative authorization.

## MUST
- Authorize every protected operation server-side using authenticated identity and current policy.
- Enforce object ownership and tenant boundaries on every applicable resource lookup or mutation.
- Default to deny when permission is absent, ambiguous, or cannot be evaluated.
- Test horizontal and vertical privilege escalation explicitly.

## MUST NOT
- Rely on UI visibility, client claims without validation, obscured identifiers, or routing conventions as authorization.
- Grant broad permissions merely to resolve an implementation failure.

## SHOULD
- Centralize reusable policy while keeping resource-specific checks close to protected resources.

## Exceptions
Any temporary privilege expansion requires owner, expiry, rationale, auditability, and approval appropriate to impact.

## Verification
Review authorization matrices, policy configuration, negative integration tests, cross-tenant tests, and access logs.