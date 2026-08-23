# Authentication and Authorization

## Purpose
Implement identity and access controls consistently across browser, API, and backend resources.

## When to use
Login flows, protected APIs, role/permission changes, multi-tenant features, or security reviews.

## Inputs
Identity provider, trust model, user roles, resource ownership, token/session model, security requirements.

## Context to inspect
Authentication middleware, cookies/tokens, claims, authorization policies, CORS/CSRF controls, client storage, logout and refresh behavior.

## Core knowledge
Authentication establishes identity; authorization decides actions on resources. Server-side enforcement is authoritative. Sessions/tokens require lifecycle, revocation, expiry, audience, issuer, and storage considerations.

## Procedure
1. Define actors and protected resources.
2. Map operations to explicit authorization rules.
3. Validate token/session issuer, audience, expiry, and integrity.
4. Enforce authorization at server boundaries.
5. Use resource-level checks where ownership matters.
6. Protect browser credentials against XSS and CSRF according to storage model.
7. Define refresh, logout, and revocation behavior.
8. Apply least privilege to service identities.
9. Test positive and negative access paths.
10. Log security-relevant events without secrets.

## Decision points
Prefer policy/permission checks over scattered role conditionals. Choose cookie or bearer-token patterns based on client architecture and threat model.

## Common failure patterns
UI-only authorization, trusting client claims blindly, long-lived tokens, insecure browser storage, missing tenant checks, wildcard CORS, and secrets in logs.

## Verification
Attempt unauthorized, cross-user, cross-tenant, expired, forged, and revoked access paths; verify server denial.

## Expected output
Explicit, tested identity and authorization boundaries.

## Stop conditions
Escalate ambiguous privilege policy or changes with material security/compliance impact.