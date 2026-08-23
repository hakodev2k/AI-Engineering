# Authentication and Session UX

## Purpose
Implement frontend authentication/session behavior that coordinates securely with the identity/backend system while providing predictable sign-in, expiration, renewal, logout, and authorization-aware UX.

## When to use
Use for login/logout, OIDC/OAuth clients, session expiry, token renewal, protected navigation, or multi-tab authentication behavior.

## Inputs
Identity architecture, OAuth/OIDC configuration, backend session/token model, authorization rules, redirect policy, and UX requirements.

## Context to inspect
Auth client, callback routes, credential storage, cookie settings visible to client, renewal logic, route guards, API interceptors, logout, and multi-tab synchronization.

## Core knowledge
The frontend can represent authentication state but cannot enforce authorization. OAuth/OIDC flows require state/nonce/PKCE where applicable and exact redirect handling. Renewal races and stale multi-tab sessions are common production defects.

## Procedure
1. Understand the authoritative identity/session lifecycle.
2. Map unauthenticated, authenticating, authenticated, expired, and failed states.
3. Configure approved OAuth/OIDC flow and redirect URIs.
4. Avoid exposing credentials beyond architectural necessity.
5. Coordinate API authentication without retry loops.
6. Handle expiry and renewal with single-flight/concurrency control.
7. Preserve safe intended navigation through login where required.
8. Implement logout across relevant local/server/identity sessions.
9. Handle permission changes and multi-tab state refresh.
10. Test expiry, denied consent, callback errors, clock skew, and repeated requests.

## Decision points
Prefer backend-managed secure sessions when architecture permits. Use silent renewal only when identity-provider/browser policy supports it reliably; otherwise design explicit reauthentication.

## Common failure patterns
Frontend-only authorization, open redirects, renewal storms, long-lived client-readable credentials, infinite 401 retries, stale permissions, and incomplete logout.

## Verification
Unauthorized backend calls are rejected, login callbacks validate correctly, expiry/renewal is bounded, logout removes effective access, and multi-tab behavior matches requirements.

## Expected output
A secure, tested authentication/session UX aligned with server and identity-provider semantics.

## Stop conditions
Escalate when identity flow is undocumented, redirect origins are unsafe, credential handling violates security policy, or authorization ownership is unclear.