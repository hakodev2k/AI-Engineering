# Authorization

## Purpose
Prevent unauthorized access when gateway policy participates in access control.

## Scope
Route, scope, role, claim, tenant, resource, and policy-based authorization.

## MUST
- Authorization decisions MUST use authenticated identity and explicit policy.
- Default behavior for protected resources MUST be deny unless access is granted.
- Tenant or resource boundaries enforced at the gateway MUST be validated against trusted attributes.
- High-risk access policy changes MUST require review and auditable approval.

## MUST NOT
- MUST NOT treat authentication as authorization.
- MUST NOT trust client-supplied privilege or tenant headers unless they are cryptographically or operationally protected by a trusted boundary.
- MUST NOT broaden access to fix integration failures without security review.

## SHOULD
- Policies SHOULD follow least privilege and be expressed in testable form.
- Authorization decisions SHOULD emit safe audit evidence.

## Exceptions
Temporary access requires owner, justification, expiry, compensating controls, and security approval.

## Verification
Run positive and negative policy tests, tenant-boundary tests, configuration diff review, audit-log inspection, and least-privilege review.