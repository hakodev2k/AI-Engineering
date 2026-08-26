# Mobile Authorization

## Purpose
Ensure privileged actions and data access are authorized by trustworthy policy rather than client UI or mutable local state.

## When to use
Use for role-based features, premium capabilities, administrative actions, object access, payments, and multi-tenant data.

## Inputs
Authorization model, API contracts, roles/claims, resource ownership rules, threat model.

## Preconditions
Identify authoritative policy enforcement points.

## Context to inspect
Backend endpoints, claims, local feature flags, cached entitlements, deep links, background tasks, and alternate API paths.

## Core knowledge
The mobile client is not a trusted authorization boundary. Server-side checks must validate subject, action, resource, tenant, and relevant context.

## Procedure
1. Enumerate privileged operations and protected resources.
2. Map required policy for each operation.
3. Locate authoritative server checks.
4. Remove reliance on hidden UI or local flags.
5. Validate object- and tenant-level access.
6. Define entitlement refresh and revocation behavior.
7. Test direct API calls and manipulated client state.
8. Add audit signals for sensitive decisions.

## Decision points
Use coarse roles only when they accurately model policy; use resource/context-aware authorization for ownership and tenant boundaries. Cache entitlements only with bounded staleness.

## Common failure patterns
UI-only authorization, IDOR/BOLA, trusting client-supplied role or price, stale entitlements, inconsistent endpoint checks, and missing tenant validation.

## Verification
Demonstrate denied access using manipulated clients, alternate endpoints, stale claims, and cross-account resource identifiers.

## Expected output
Consistent server-enforced authorization with explicit policies and abuse-case tests.

## Stop conditions
Escalate when ownership semantics, tenant boundaries, or authoritative policy sources are ambiguous.