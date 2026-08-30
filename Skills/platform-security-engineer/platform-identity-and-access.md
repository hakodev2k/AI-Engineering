# Platform Identity and Access

## Purpose
Design and review identity, authentication, authorization, and privilege boundaries for internal platforms so users, services, automation, and workloads receive only the access they require.

## When to use
Use when introducing a new platform service, onboarding a new identity source, designing administrative access, reviewing privilege escalation risk, or standardizing access controls across platform components.

## Inputs
Identity provider configuration, role model, service-account design, API authorization rules, infrastructure IAM, group mappings, access reviews, break-glass procedures, and audit logs.

## Context to inspect
Inspect human and workload identities separately, token issuance and lifetime, role inheritance, group-to-role mappings, impersonation paths, service-to-service authentication, administrative endpoints, temporary privilege mechanisms, and stale credentials.

## Core knowledge
Platform IAM should minimize standing privilege, make machine identities explicit, separate authentication from authorization, support scoped and time-bounded elevation, and produce auditable decisions. Authorization must be enforced at the resource boundary, not merely in UI or workflow layers.

## Procedure
1. Inventory human, service, workload, and automation identities.
2. Map identities to resources and privileged actions.
3. Identify broad roles, wildcard permissions, and implicit inheritance.
4. Define least-privilege role boundaries around actual operational tasks.
5. Prefer short-lived federated credentials over long-lived static secrets.
6. Separate tenant administration from platform administration.
7. Add approval or just-in-time elevation for high-impact actions.
8. Enforce authorization server-side at every privileged API boundary.
9. Define joiner, mover, leaver, and service decommissioning flows.
10. Add periodic access review and stale-identity detection.
11. Validate auditability of grants, denials, elevations, and administrative changes.
12. Test representative privilege-escalation and cross-tenant abuse cases.

## Decision points
Use RBAC when roles map cleanly to stable job functions; use ABAC or policy-based controls when decisions depend on tenant, environment, resource labels, or context. Prefer centralized policy only when enforcement remains reliable during dependency failure.

## Common failure patterns
Shared service accounts, wildcard permissions, permanent admin roles, authorization only in the frontend, inherited privileges nobody owns, non-expiring tokens, and missing offboarding for machine identities.

## Verification
Verify with denied-access tests, privilege-path tests, token inspection, access-review evidence, audit logs, and confirmation that emergency access is monitored and reversible.

## Expected output
A least-privilege identity model, enforceable authorization design, privilege-elevation process, and measurable review controls.

## Stop conditions
Stop and escalate when identity ownership is unknown, emergency access cannot be audited, required changes could lock out production operations, or privileged access depends on undocumented exceptions.