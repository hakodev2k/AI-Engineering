# Authentication and Authorization

## Purpose
Implement and review identity and access control with least privilege, explicit trust boundaries, and testable policies.

## When to use
New protected endpoints, JWT/OIDC integration, role/policy changes, service-to-service auth, or security review.

## Inputs
Identity provider, token type, claims, resources, roles/policies, tenant model, threat assumptions.

## Context to inspect
Authentication handlers, issuer/audience validation, token lifetime, authorization policies, resource ownership checks, secret/certificate storage.

## Core knowledge
Authentication proves identity; authorization decides permitted action. Tokens must validate issuer, audience, signature, lifetime. Claims are inputs, not automatically sufficient authorization.

## Procedure
1. Define actors, resources, actions, and trust boundaries.
2. Validate token configuration and transport security.
3. Map external identity claims deliberately.
4. Prefer policy/resource-based authorization over scattered role checks.
5. Enforce authorization server-side on every protected action.
6. Apply tenant/resource ownership checks.
7. Keep privileges minimal.
8. Log security-relevant denials without leaking credentials.
9. Add positive and negative authorization tests.

## Decision points
Use roles for coarse stable organizational permissions; policies/claims/resource checks for contextual access.

## Common failure patterns
Authentication without authorization, trusting client-supplied IDs, missing audience validation, admin-role sprawl, secrets in config, relying on UI restrictions.

## Verification
Unauthorized/forbidden tests, token validation tests, tenant-boundary tests, policy review.

## Expected output
Explicit least-privilege access rules enforced at trusted boundaries.

## Stop conditions
Escalate identity-provider, privileged-permission, or cryptographic changes requiring security approval.