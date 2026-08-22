# API Authentication and Authorization

## Purpose
Design and review identity and access controls at API boundaries.

## When to use
Use for protected endpoints, identity integration, permission changes, and security reviews.

## Inputs
Identity provider, token model, actors, permissions, data ownership, and threat model.

## Context to inspect
Authentication middleware, token validation, scopes/roles, object-level authorization, service identities, and audit requirements.

## Core knowledge
Authentication proves identity; authorization decides permitted action. Validate issuer, audience, signature, lifetime, and relevant claims. Enforce authorization server-side at every protected resource boundary.

## Procedure
1. Identify actors and trust boundaries.
2. Define authentication mechanism.
3. Validate token lifecycle and claims.
4. Model least-privilege permissions.
5. Enforce function- and object-level authorization.
6. Separate user and service identities.
7. Define denial behavior without information leakage.
8. Add audit evidence for sensitive actions.
9. Test negative and privilege-escalation cases.

## Decision points
Prefer scopes for delegated capabilities and domain policies for contextual rules; avoid embedding volatile business logic solely in token roles.

## Common failure patterns
Authentication without authorization, trusting client-supplied ownership, excessive scopes, missing audience validation, and authorization only in UI.

## Verification
Unauthorized, cross-tenant, expired-token, wrong-audience, and least-privilege tests pass.

## Expected output
A defensible API access-control design.

## Stop conditions
Escalate unresolved identity ownership, regulatory constraints, or high-impact privilege changes.