# Authorization Architecture Rules

## Purpose
Protect resources through explicit, least-privilege, centrally understandable authorization decisions.

## Scope
User, service, administrative, tenant, resource, and policy-based authorization.

## MUST
- Authorization MUST be enforced at the resource or service boundary where the protected action is performed.
- Policies MUST define subject, action, resource, context, and denial behavior where applicable.
- Default behavior MUST deny access when no valid permission grants it.
- Privilege escalation paths and delegated administration MUST be explicitly modeled and reviewed.
- Cross-tenant access MUST require explicit, testable policy.

## MUST NOT
- MUST NOT rely on UI visibility or client-side checks as authoritative authorization.
- MUST NOT infer authorization solely from successful authentication.
- MUST NOT grant broad wildcard privileges when narrower permissions satisfy the requirement.

## SHOULD
- Policies SHOULD be centrally governed while allowing domain-specific enforcement where appropriate.
- High-risk authorization decisions SHOULD be auditable with sufficient context for investigation.

## Exceptions
Exceptions require business justification, bounded scope, compensating controls, expiration, and risk-owner approval.

## Verification
Review policy definitions, privilege matrices, negative tests, tenant-isolation tests, access logs, and privileged-role assignments.