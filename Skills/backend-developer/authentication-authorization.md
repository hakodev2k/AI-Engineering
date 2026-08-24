# Authentication and Authorization

## Purpose
Implement identity and access controls that authenticate principals correctly and enforce authorization at every protected boundary.

## When to use
Use for protected APIs, service-to-service identity, permission changes, multi-tenant systems, and access-control reviews.

## Inputs
Identity provider, token/session model, roles/permissions, resource ownership rules, threat model, tenancy model.

## Context to inspect
Authentication middleware, token validation, policy checks, endpoint annotations, service-layer checks, tenant resolution, audit logs, and secrets.

## Core knowledge
OAuth/OIDC concepts, token validation, sessions, claims, RBAC/ABAC, resource-based authorization, least privilege, tenant isolation, and auditability.

## Procedure
1. Identify principals, resources, and allowed actions.
2. Separate authentication from authorization decisions.
3. Validate issuer, audience, signature, expiry, and relevant token properties.
4. Enforce authorization server-side at the resource boundary.
5. Apply tenant/resource ownership checks independent of client input.
6. Deny by default and minimize privileges.
7. Add audit events for sensitive actions.
8. Test anonymous, unauthorized, cross-tenant, expired, and revoked scenarios.

## Decision points
Use coarse roles for stable organizational permissions; use policies/attributes for resource-specific rules. Prefer short-lived credentials and centralized identity over bespoke password systems.

## Common failure patterns
Trusting client claims blindly, missing object-level authorization, tenant ID injection, overly broad roles, secrets in code, and authentication-only protection.

## Verification
Run negative authorization tests, token validation tests, tenant-boundary tests, and audit-log checks.

## Expected output
Explicit, testable access-control policies enforced at backend boundaries.

## Stop conditions
Stop when identity ownership is unclear, privileged access needs security approval, or requirements conflict with least-privilege controls.