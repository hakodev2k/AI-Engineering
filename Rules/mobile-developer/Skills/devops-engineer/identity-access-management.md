# Identity and Access Management

## Purpose
Design least-privilege human and workload access across infrastructure and delivery systems.

## When to use
Use for IAM roles, service principals, managed identities, CI permissions, admin access, or access reviews.

## Inputs
Actors, resources, required actions, authentication methods, environment boundaries, compliance requirements.

## Context to inspect
Role assignments, inherited permissions, groups, service accounts, token lifetime, MFA, privileged access, audit logs.

## Core knowledge
Authorize by job function and workload need. Separate identities by environment and trust boundary. Prefer temporary elevation, MFA for humans, federation for automation, and deny-by-default.

## Procedure
1. Map actors to required operations.
2. Remove permissions not tied to a concrete need.
3. Separate human and workload identities.
4. Use groups/roles instead of direct grants where possible.
5. Require MFA and controlled elevation for privileged users.
6. Prefer OIDC/federation for CI.
7. Scope resource and environment access.
8. Review dormant identities.
9. Enable audit logging.
10. Test denied as well as allowed paths.

## Decision points
Use custom roles only when built-ins are materially overprivileged; centralize identity governance but keep resource ownership clear.

## Common failure patterns
Owner/admin for automation, shared accounts, permanent privilege, cross-environment identities, no access expiry.

## Verification
Effective permissions match the matrix, unauthorized actions fail, audit events are traceable, privileged elevation expires.

## Expected output
Least-privilege access model and reviewable permission evidence.

## Stop conditions
Stop if required access would create uncontrolled production-wide privilege.