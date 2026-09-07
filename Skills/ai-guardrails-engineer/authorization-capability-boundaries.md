# Authorization and Capability Boundaries

## Purpose
Limit AI actions through least-privilege capabilities even when reasoning fails.

## When to use
Use for agents, multi-tenancy, privileged retrieval, admin actions, delegation.

## Inputs
Identity, roles, resources, tools, delegation, tenancy, impact.

## Context to inspect
Inspect credentials, sessions, impersonation, resource IDs, delegation, tools, service permissions.

## Core knowledge
Authentication identifies principals; authorization validates action/resource/context/delegation. Narrow capabilities reduce blast radius.

## Procedure
1. Identify principals/delegates.
2. Enumerate resources/actions.
3. Define minimum capabilities.
4. Bind to authenticated tenant sessions.
5. Prevent model privilege selection.
6. Use short-lived scopes.
7. Revalidate at resources.
8. Restrict delegation.
9. Audit elevation.
10. Test escalation.

## Decision points
Prefer explicit capabilities over broad inherited roles.

## Common failure patterns
Trusted client ownership, global accounts, prompt authorization, confused deputy, tenantless keys.

## Verification
Forged IDs/roles fail at resource boundaries.

## Expected output
Capability matrix and escalation tests.

## Stop conditions
Stop without verified principal/resource binding.