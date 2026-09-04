# Authorization Policy Rules

## Purpose
Ensure authorization policies enforce least privilege and cannot be bypassed through ambiguous identity, resource, or action semantics.

## Scope
Applies to policies that permit or deny access to APIs, services, resources, data, administrative functions, and privileged operations.

## MUST
- Authorization decisions MUST evaluate authenticated subject, requested action, target resource, and relevant contextual constraints.
- Default behavior MUST be deny when no applicable allow rule exists for security-sensitive access.
- Privileged access policies MUST require explicit grants and MUST be separately reviewable from ordinary access rules.
- Resource ownership, roles, groups, and entitlements MUST come from validated authoritative data.
- Cross-tenant and cross-environment access MUST be explicitly modeled and test-covered.

## MUST NOT
- Authentication success MUST NOT imply authorization.
- Wildcard permissions MUST NOT be introduced without documented scope, necessity, and risk review.
- Client-provided roles, ownership claims, or tenant identifiers MUST NOT be trusted without server-side validation.
- Temporary access exceptions MUST NOT become permanent through missing expiry controls.

## SHOULD
- Policies SHOULD prefer narrowly scoped capabilities over broad role grants.
- High-risk actions SHOULD require contextual controls such as stronger assurance, approval, or constrained execution conditions.

## Exceptions
Exceptions require business justification, bounded scope, expiry, compensating controls, verification evidence, and accountable approval.

## Verification
Run positive and negative authorization tests, privilege-escalation tests, tenant-isolation tests, policy simulation, and audit review. Verify denied paths and absence-of-grant cases explicitly.