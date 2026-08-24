# Authorization Rules

## Purpose
Ensure authenticated identities can perform only explicitly permitted actions on permitted resources.

## Scope
Role-, claim-, policy-, attribute-, tenant-, and resource-based access control.

## MUST
- Authorization MUST be enforced server-side for every protected operation.
- Decisions MUST consider both action and target resource where object-level access matters.
- Default behavior MUST deny access when no explicit permission applies.
- Tenant and ownership boundaries MUST be enforced independently of client input.

## MUST NOT
- MUST NOT infer authorization from UI visibility or client-supplied roles.
- MUST NOT rely solely on authentication as proof of permission.
- MUST NOT bypass authorization checks for internal endpoints unless equivalent trusted controls exist and are documented.

## SHOULD
- Authorization policies SHOULD be centralized enough to remain consistent and testable.
- High-risk permissions SHOULD be narrowly scoped and periodically reviewed.

## Exceptions
Temporary access exceptions require explicit owner, scope, expiry, reason, and approval proportional to risk.

## Verification
Use policy tests, tenant-isolation tests, privilege-escalation tests, code review, and access-control configuration inspection.