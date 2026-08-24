# Authorization Policy Rules

## Purpose
Make access decisions explicit, least-privileged, testable, and attributable.

## Scope
RBAC, ABAC, policy engines, entitlement checks, resource authorization, and administrative authorization.

## MUST
- Authorization MUST be enforced server-side or at an equivalent trusted enforcement point for every protected operation.
- Policies MUST define subject, resource, action, conditions, decision semantics, and ownership.
- Deny behavior MUST be deterministic when required attributes or policy dependencies are unavailable.
- Privileged policy changes MUST be reviewed and auditable.

## MUST NOT
- MUST NOT infer authorization from successful authentication alone.
- MUST NOT trust client-provided roles, groups, or entitlement claims without validated provenance.
- MUST NOT grant broad wildcard permissions when narrower permissions satisfy the requirement.

## SHOULD
- Prefer reusable policy primitives and explicit deny rules for prohibited high-risk combinations.
- Test policy boundaries and negative cases as first-class scenarios.

## Exceptions
Exceptions require documented business need, bounded scope, expiry, compensating controls, and approval.

## Verification
Use policy tests, access-control matrices, negative integration tests, configuration inspection, and audit-log review.