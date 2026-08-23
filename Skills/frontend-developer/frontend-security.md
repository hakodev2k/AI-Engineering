# Frontend Security

## Purpose
Reduce client-side attack surface by applying secure rendering, authentication handling, browser security controls, dependency hygiene, and safe treatment of untrusted data.

## When to use
Use for authentication flows, rendering user content, external links, uploads, third-party scripts, token handling, or security reviews.

## Inputs
Threat model, application code, auth design, API contracts, CSP/security headers, dependencies, and data classifications.

## Context to inspect
HTML injection points, URL construction, storage, cookies, auth state, CORS assumptions, CSP, iframe usage, third-party scripts, dependency advisories, and build-time secrets.

## Core knowledge
The browser is an untrusted client. Never rely on frontend authorization for access control. XSS often converts client-accessible credentials into account compromise. Output encoding/safe DOM APIs, restrictive CSP, secure cookie design, and server enforcement are primary controls.

## Procedure
1. Identify untrusted inputs and dangerous rendering sinks.
2. Prefer framework escaping and safe DOM APIs.
3. Sanitize only when rich HTML is a real requirement.
4. Validate URLs and external navigation behavior.
5. Keep secrets out of shipped bundles.
6. Review credential/token storage and lifetime.
7. Confirm server-side authorization for every privileged operation.
8. Minimize and constrain third-party scripts.
9. Review CSP and related browser headers with backend/platform owners.
10. Add tests or security checks for discovered attack paths.

## Decision points
Prefer HttpOnly secure cookies when architecture supports them; client-readable tokens may be necessary in some systems but increase XSS consequences. Permit raw HTML only with a maintained sanitizer and explicit need.

## Common failure patterns
Trusting hidden buttons as authorization, storing long-lived tokens in localStorage without threat analysis, unsafe `innerHTML`, secrets in environment bundles, wildcard messaging origins, and blindly accepting redirect URLs.

## Verification
Security tests demonstrate unsafe payloads are neutralized, privileged APIs reject unauthorized requests, bundles contain no secrets, and configured browser policies are observed in deployed responses.

## Expected output
A hardened frontend with documented threats, controls, residual risks, and verification evidence.

## Stop conditions
Escalate suspected credential exposure, exploitable XSS, unresolved auth architecture, or security controls requiring production/platform approval.