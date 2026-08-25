# Web Application Security Review

## Purpose
Review browser-facing applications for security failures created by browser trust, rendering, navigation, and session behavior.

## When to use
Use for new web applications, major UI/auth changes, embedded content, uploads, or security assessments.

## Inputs
Routes, frontend/backend code, headers, cookies, CSP, forms, templates, upload flows, and deployment configuration.

## Context to inspect
Inspect DOM sinks, server rendering, CSRF protections, cookie scope, CORS, CSP, iframe usage, redirects, downloads, and third-party scripts.

## Core knowledge
Browser security depends on origin boundaries, cookie semantics, content interpretation, navigation, and script execution. XSS often defeats browser-side controls; CSRF matters when ambient credentials authorize state changes.

## Procedure
1. Map origins, subdomains, sessions, and cross-origin interactions.
2. Review XSS sinks and templating behavior.
3. Review CSRF defenses for state-changing requests.
4. Validate cookies: Secure, HttpOnly, SameSite, scope, rotation.
5. Review CSP and other relevant response headers.
6. Test redirects, URL handling, framing, and postMessage origin validation.
7. Review uploads/downloads for type confusion and active content.
8. Inventory third-party scripts and integrity/trust assumptions.
9. Add browser-level regression tests for critical defenses.

## Decision points
Use same-site cookies and anti-CSRF tokens according to architecture. CSP is defense-in-depth, not a replacement for safe rendering. Separate origins when strong isolation is required.

## Common failure patterns
DOM XSS, wildcard CORS with credentials, open redirects used in auth flows, unsafe postMessage, and active uploads served inline.

## Verification
Use production-like headers and browser tests; confirm exploit strings remain inert and cross-origin requests cannot violate policy.

## Expected output
Web-specific findings, fixes, and verified browser-security behavior.

## Stop conditions
Escalate on active credential theft, unsafe shared-domain architecture requiring redesign, or third-party script compromise.