# Browser Security Rules

## Purpose
Protect web applications against origin confusion, script injection, cross-site request attacks, unsafe framing, and browser-side data exposure.

## Scope
Applies to browser applications, server-rendered pages, cookies, CSP, CORS, framing, storage, redirects, and cross-origin integrations.

## MUST
- State-changing browser requests using ambient credentials MUST have effective CSRF defenses unless the request construction makes CSRF infeasible by design.
- CORS policies MUST enumerate trusted origins and required methods/headers; credentialed access MUST NOT use an unrestricted origin policy.
- Untrusted content MUST be encoded or sanitized for its exact rendering context.
- Sensitive authentication state MUST use cookie and storage mechanisms appropriate to its theft and replay risk.
- Applications that render web content MUST define anti-framing behavior where clickjacking could cause privileged actions.
- Content Security Policy and related browser controls MUST be evaluated as defense-in-depth for applications with meaningful script-injection risk.

## MUST NOT
- MUST NOT insert untrusted strings into executable DOM or script contexts through unsafe sinks without an approved sanitization strategy.
- MUST NOT store long-lived privileged bearer credentials in browser-accessible storage without explicit threat analysis.
- MUST NOT implement open redirects that allow attacker-controlled destinations in security-sensitive flows.

## SHOULD
- SHOULD minimize third-party scripts and isolate untrusted active content onto separate origins.
- SHOULD use browser security headers consistently through centrally managed configuration.

## Exceptions
Exceptions require documented browser threat, compatibility constraint, compensating control, test evidence, and security approval.

## Verification
Use browser tests, header inspection, CSP/CORS review, CSRF tests, DOM/static analysis, redirect tests, storage inspection, and targeted XSS testing.