# GraphQL Authorization

## Purpose
Enforce authorization consistently across graph entry points and fields without relying on client behavior or accidental resolver structure.

## When to use
Use when exposing protected objects, fields, mutations, subscriptions, or tenant-scoped data.

## Inputs
Identity model, permission rules, schema, resolver graph, tenant model, and sensitive-data classification.

## Context to inspect
Inspect authentication context, policy framework, object ownership, field sensitivity, loaders, caching, federation, and subscription delivery.

## Core knowledge
Authentication establishes identity; authorization decides permitted actions and data. GraphQL authorization may be operation-, object-, or field-level. Filtering unauthorized rows is not equivalent to authorizing the operation itself.

## Procedure
1. Define the protected business capability.
2. Map required permissions to schema surfaces.
3. Enforce coarse authorization before expensive work.
4. Enforce object/field rules where data sensitivity differs.
5. Carry tenant and subject context into loaders and services.
6. Prevent unauthorized data from entering shared caches.
7. Define behavior for forbidden fields versus forbidden operations.
8. Secure introspection or tooling only when justified; never treat hiding schema as authorization.
9. Test horizontal and vertical privilege escalation.
10. Audit denied access with safe metadata.

## Decision points
Prefer centralized policies for reusable rules and domain checks for resource-specific ownership. Field authorization is appropriate for genuinely field-sensitive data but can add execution cost and complexity.

## Common failure patterns
Authorization only at top-level queries, trusting client-supplied tenant IDs, cross-tenant DataLoader keys, exposing fields through alternate graph paths, and treating introspection disablement as security.

## Verification
Run positive and negative tests across roles, tenants, aliases, nested paths, loaders, and mutations. Verify no unauthorized data appears in errors or traces.

## Expected output
A documented authorization model enforced at all relevant graph paths.

## Stop conditions
Stop if permission ownership is ambiguous or a requested field has no approved access policy.