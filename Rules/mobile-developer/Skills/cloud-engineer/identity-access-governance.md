# Identity and Access Governance

## Purpose
Design least-privilege access for humans, workloads, automation, and external identities.

## When to use
Use for cloud onboarding, access reviews, privilege redesign, incident remediation, and new workload identities.

## Inputs
Identity provider, role catalog, resource hierarchy, service identities, access requirements, audit evidence.

## Context to inspect
Federation, MFA, privileged roles, service principals, keys, trust policies, dormant identities, break-glass access.

## Core knowledge
Prefer federation, short-lived credentials, workload identity, separation of duties, and scoped roles. Authorization must follow resource boundaries and business responsibilities.

## Procedure
1. Inventory identities and privilege paths.
2. Map required actions to roles.
3. Remove unnecessary standing privilege.
4. Enforce strong authentication and conditional controls.
5. Replace static workload credentials where possible.
6. Define just-in-time elevation and approvals.
7. Protect emergency access separately.
8. Enable audit trails and periodic reviews.
9. Test denied as well as allowed operations.

## Decision points
Use custom roles only when built-in roles are materially overbroad. Prefer temporary elevation for rare administration.

## Common failure patterns
Wildcard permissions, shared accounts, permanent admin roles, long-lived keys, privilege inherited accidentally, and unmonitored service identities.

## Verification
Validate effective permissions using representative personas and workloads; confirm privilege changes are logged and revocation works.

## Expected output
A least-privilege identity model with auditable lifecycle controls.

## Stop conditions
Escalate when required duties cannot be separated or emergency access ownership is undefined.