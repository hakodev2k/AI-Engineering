# Authorization Rules

## Purpose
Ensure authenticated identities can perform only explicitly permitted actions.

## Scope
Applies to endpoints, application services, resources, administrative operations, and service-to-service access.

## MUST
- Authorization MUST be enforced server-side at every protected boundary.
- Decisions MUST use explicit policy, role, claim, ownership, or resource rules appropriate to the operation.
- Sensitive operations MUST default to deny when required authorization context is missing or ambiguous.
- Resource-level authorization MUST be checked before reading or mutating protected data.
- Elevated permissions MUST be narrowly scoped and auditable.

## MUST NOT
- MUST NOT rely on UI hiding, client claims, route obscurity, or caller convention as authorization.
- MUST NOT grant broad roles merely to bypass a missing policy.
- MUST NOT combine authentication success with authorization success implicitly.

## SHOULD
- Prefer policy-based authorization over scattered ad hoc checks.
- Centralize reusable resource-access rules while keeping domain-specific decisions explicit.

## Exceptions
High-risk access exceptions require documented business reason, expiry where possible, security review, and approval.

## Verification
Use authorization matrix tests, negative tests, resource-ownership tests, configuration inspection, and audit-log review.