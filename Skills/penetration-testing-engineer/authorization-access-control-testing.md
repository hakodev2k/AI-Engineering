# Authorization and Access Control Testing

## Purpose
Verify that users, services, and tenants can perform only explicitly permitted actions on explicitly permitted resources.

## When to use
Use wherever roles, ownership, tenancy, scopes, administrative privileges, or workflow states control access.

## Inputs
Roles, permissions, test identities, resource ownership, API/application functions, and business rules.

## Context to inspect
Inspect object access, privileged functions, tenant boundaries, hidden operations, exports, bulk actions, indirect references, and state-dependent permissions.

## Core knowledge
Authorization must be enforced server-side at every relevant operation. Test horizontal, vertical, contextual, and cross-tenant boundaries. A hidden button is not authorization.

## Procedure
1. Build an actor-resource-action matrix.
2. Create controlled resources owned by different test identities/tenants.
3. Capture valid baseline operations.
4. Replay operations using lower-privileged actors.
5. Substitute resource identifiers and nested references.
6. Test privileged and administrative operations directly.
7. Test authorization after role/state changes.
8. Inspect batch, export, search, and indirect access paths.
9. Confirm whether denial occurs before side effects.
10. Record minimal reproducible evidence.

## Decision points
Prioritize boundaries protecting sensitive data or irreversible actions. Use test data instead of enumerating real records whenever possible.

## Common failure patterns
Testing only URL access, missing APIs behind disabled UI, conflating authentication with authorization, overlooking secondary objects, and proving impact by accessing excessive real data.

## Verification
Repeat with multiple identities, verify no side effect occurs on denied operations, and demonstrate the precise permission invariant that fails.

## Expected output
Access-control findings mapped to actor, resource, action, expected policy, observed behavior, impact, and fix direction.

## Stop conditions
Stop if proving a flaw would require broad access to real sensitive records or destructive privileged actions.