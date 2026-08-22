# RBAC and Service Accounts

## Purpose
Design least-privilege Kubernetes API access for humans, workloads, and automation.

## When to use
New workloads, platform automation, access reviews, or security incidents.

## Inputs
Actors, required API operations, namespaces, automation flows, and identity-provider model.

## Context to inspect
Roles, ClusterRoles, bindings, ServiceAccounts, token usage, impersonation, and cloud workload identity.

## Core knowledge
RBAC grants API permissions; namespace boundaries do not constrain cluster-scoped privileges. Long-lived service-account credentials increase exposure.

## Procedure
1. Identify actor and exact required operations.
2. Separate human and workload identities.
3. Prefer namespace Roles over ClusterRoles when sufficient.
4. Bind permissions narrowly.
5. Avoid wildcard verbs/resources unless justified.
6. Use workload identity or short-lived tokens where available.
7. Test with authorization checks and representative calls.
8. Review privilege escalation paths.

## Decision points
Create reusable ClusterRoles only for genuinely common permission sets; aggregate carefully and inspect inherited power.

## Common failure patterns
cluster-admin shortcuts, wildcard access, shared service accounts, token mounting when unnecessary, and overlooking bind/escalate/impersonate permissions.

## Verification
Prove required actions succeed and unauthorized actions fail; inspect effective permissions.

## Expected output
Minimal RBAC and identity assignments with rationale.

## Stop conditions
Escalate requests requiring privileged access without an approved security justification.