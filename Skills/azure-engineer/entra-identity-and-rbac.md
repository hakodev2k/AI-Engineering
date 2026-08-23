# Entra Identity and Azure RBAC

## Purpose
Design and operate least-privilege human and workload access across Azure using Microsoft Entra ID and Azure RBAC.

## When to use
Use for access design, subscription onboarding, managed identities, privileged operations, service principals, and authorization incidents.

## Inputs
Actors, workload identities, required actions, scopes, existing role assignments, group structure, privileged workflows, and audit requirements.

## Context to inspect
Inspect tenant settings, groups, service principals, managed identities, role definitions, role assignments, PIM, conditional access dependencies, and activity/audit logs.

## Core knowledge
Authentication and Azure authorization are separate concerns. Prefer group-based assignments for humans and managed identities for Azure workloads. Scope permissions as narrowly as operationally practical and use privileged elevation for high-impact roles.

## Procedure
1. Identify each actor and required Azure operation.
2. Map operations to resource scopes.
3. Search built-in roles before creating custom roles.
4. Assign human access through groups where practical.
5. Prefer managed identity over stored application credentials.
6. Apply PIM or equivalent time-bound controls to privileged human access.
7. Remove redundant inherited assignments.
8. Document exceptional direct assignments and expiration.
9. Test both allowed and denied operations.
10. Monitor role-assignment changes and periodically review access.

## Decision points
Choose system-assigned identity when lifecycle should follow one resource; user-assigned identity when multiple resources need a stable reusable identity. Create custom roles only when built-in roles materially overgrant or omit required actions.

## Common failure patterns
Owner at subscription scope for convenience, direct user assignments everywhere, long-lived client secrets, confusing Entra directory roles with Azure RBAC, and testing only successful access.

## Verification
Use effective-access checks and real operations to prove required actions succeed while out-of-scope actions fail. Review audit logs for unexpected assignments.

## Expected output
A least-privilege identity and authorization design with traceable scopes, roles, owners, and verification evidence.

## Stop conditions
Stop when required privilege cannot be expressed safely, tenant policies are unknown, or changing access could lock out administrators without a recovery path.