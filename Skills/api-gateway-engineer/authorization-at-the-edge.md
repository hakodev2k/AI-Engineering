# Authorization at the Edge

## Purpose
Apply coarse-grained access policy at the gateway without duplicating domain authorization that belongs in backend services.

## When to use
Use for route-level scopes, roles, tenant boundaries, policy-engine integration, or authorization review.

## Inputs
Access model, identity claims, route inventory, policy source, exception requirements.

## Context to inspect
Existing service-side authorization, claim semantics, tenant identifiers, policy engines, privileged routes, audit requirements.

## Core knowledge
Understand RBAC, ABAC, scopes, policy decision points, least privilege, confused-deputy risks, tenant isolation, and deny-by-default design.

## Procedure
1. Separate coarse gateway authorization from resource-specific service authorization.
2. Map routes to required identities, scopes, or attributes.
3. Normalize trusted claims before policy evaluation.
4. Define deny-by-default behavior and explicit exemptions.
5. Integrate external policy decisions with bounded latency and safe failure behavior when needed.
6. Prevent client-controlled headers from bypassing policy.
7. Log policy outcome without sensitive payloads.
8. Test privilege boundaries and tenant-crossing attempts.

## Decision points
Keep simple static route policy in the gateway; use a policy engine when rules require centralized, auditable evolution. Do not move object-level ownership checks out of services merely for convenience.

## Common failure patterns
Role-only checks for tenant data, fail-open policy calls, duplicated inconsistent rules, untrusted claim propagation, broad wildcard exemptions.

## Verification
Run positive, negative, privilege-escalation, cross-tenant, and policy-outage tests.

## Expected output
A least-privilege route authorization policy with clear service-side responsibility boundaries.

## Stop conditions
Escalate if business ownership rules cannot be expressed from trusted gateway context.