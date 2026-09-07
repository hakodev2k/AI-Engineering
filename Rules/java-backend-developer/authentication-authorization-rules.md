# Authentication and Authorization Rules

## Purpose
Ensure identities are verified correctly and every protected operation enforces intended access policy.

## Scope
Applies to sessions, tokens, service identities, roles, permissions, and object-level access.

## MUST
- Authentication mechanisms MUST validate issuer, audience, signature, expiry, and other protocol-required claims as applicable.
- Authorization MUST be evaluated at the protected resource or business-operation boundary, not only in UI or routing layers.
- Object-level authorization MUST verify access to the specific target resource.
- Privileged actions MUST be auditable without logging credentials or raw secrets.
- Service identities MUST use least privilege and scoped credentials.

## MUST NOT
- MUST NOT trust client-supplied roles, tenant identifiers, or ownership claims without server-side verification.
- MUST NOT use authentication success as proof of authorization.
- MUST NOT weaken access checks to resolve integration or test failures without explicit approval.

## SHOULD
- Centralize policy semantics while keeping enforcement close to protected operations.
- Prefer short-lived credentials and automated rotation supported by the platform.

## Exceptions
Emergency access requires approved break-glass procedure, bounded duration, logging, and retrospective review.

## Verification
Use positive and negative authorization tests, tenant-isolation tests, token validation tests, configuration review, audit-log inspection, and security testing.