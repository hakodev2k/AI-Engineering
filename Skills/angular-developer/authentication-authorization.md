# Authentication and Authorization

## Purpose
Implement secure frontend identity flows while treating server-side authorization as authoritative.

## When to use
Use for login integration, protected routes, permission-aware UI, token handling, and security reviews.

## Inputs
Identity provider documentation, token/session model, permissions, API security contract, and threat model.

## Context to inspect
Inspect auth service, storage, interceptors, guards, redirects, token renewal, logout, and permission checks.

## Core knowledge
Frontend checks are not security boundaries. Avoid exposing secrets to browser code. Prefer standards-based OIDC/OAuth flows suitable for public clients and minimize persistent token exposure.

## Procedure
1. Confirm identity and session architecture.
2. Use the provider-supported browser flow.
3. Define authenticated, unauthenticated, expired, and error states.
4. Attach credentials only to intended origins.
5. Implement route UX guards while retaining API authorization.
6. Centralize permission interpretation without hiding business context.
7. Handle expiry, renewal, logout, and multi-tab behavior.
8. Test privilege boundaries and failure paths.

## Decision points
Prefer secure cookies when architecture supports a backend-for-frontend; otherwise use public-client patterns and minimize storage risk.

## Common failure patterns
Secrets in bundles, authorization only in UI, tokens in unsafe storage without threat analysis, redirect loops, overbroad scopes, and logging credentials.

## Verification
Verify unauthorized API calls fail server-side, tokens are scoped correctly, logout invalidates expected state, and sensitive data is absent from logs/build artifacts.

## Expected output
A standards-based identity integration with explicit trust boundaries.

## Stop conditions
Escalate insecure provider requirements, unclear scopes, or changes affecting organization-wide identity policy.