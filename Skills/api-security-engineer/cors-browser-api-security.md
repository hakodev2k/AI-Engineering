# CORS and Browser API Security

## Purpose
Configure browser-facing APIs so cross-origin access is intentionally permitted without confusing CORS with authentication, CSRF protection, or server-side authorization.

## When to use
Use for APIs called from browsers, SPAs, embedded applications, cross-domain integrations, credentialed requests, or when changing origins, cookies, or gateway CORS policy.

## Inputs
Allowed frontend origins, credential model, authentication mechanism, cookie attributes, API routes, preflight requirements, deployment domains.

## Preconditions
Know whether browsers send cookies, bearer tokens, or other credentials and whether the API also serves non-browser clients.

## Context to inspect
Access-Control headers, origin matching, preflight handling, credentials mode, cookies, SameSite, CSRF tokens, redirects, CDN/gateway behavior, and error responses.

## Core knowledge
CORS controls which browser origins may read responses; it does not prevent direct API calls. Credentialed CORS requires explicit origins and must not combine wildcard origins with credentials. Cookie-authenticated state-changing requests may require CSRF defenses independent of CORS.

## Procedure
1. Inventory legitimate browser origins and environments.
2. Determine which endpoints need cross-origin access.
3. Use exact allowlists or carefully validated origin patterns.
4. Permit only required methods and headers.
5. Enable credentials only when necessary.
6. Align cookies with Secure, HttpOnly, SameSite, domain, and path requirements.
7. Add CSRF defenses for cookie-authenticated state changes where needed.
8. Ensure preflight failures do not disclose sensitive policy details.
9. Test allowed, denied, null, malformed, and attacker-controlled origins.
10. Verify gateway/CDN and application CORS behavior are consistent.

## Decision points
Prefer bearer-token APIs without ambient cookies when appropriate for API clients. Use credentialed browser requests only when session architecture requires them. Keep origin allowlists narrow rather than using reflective patterns.

## Common failure patterns
Reflecting arbitrary Origin, wildcard plus credentials, assuming CORS is access control, missing CSRF protection, permissive regex origin matching, and inconsistent policy between edge and application.

## Verification
Run browser and raw HTTP tests for legitimate and malicious origins, preflights, credentialed requests, and state-changing actions. Confirm unauthorized direct calls remain blocked by server authorization.

## Expected output
A minimal CORS policy aligned with credential and CSRF design, backed by negative browser-origin tests.

## Stop conditions
Escalate when required origin patterns cannot be safely constrained, session semantics are unclear, or multiple infrastructure layers rewrite CORS inconsistently.