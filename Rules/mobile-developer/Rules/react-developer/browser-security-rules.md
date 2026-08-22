# Browser Security Rules

## Purpose
Protect browser applications from common client-side security failures and unsafe trust assumptions.

## Scope
Applies to rendering, storage, navigation, external content, authentication data, and browser APIs.

## MUST
- Untrusted content MUST be treated as data and escaped/sanitized before any HTML interpretation.
- Authentication and authorization decisions MUST rely on server-enforced controls; client checks may only improve UX.
- Sensitive values stored in the browser MUST be minimized and their exposure model reviewed.
- External navigation and embedded content MUST use appropriate origin and isolation protections.
- Security-sensitive dependencies and browser capabilities MUST be reviewed for known risks and required permissions.

## MUST NOT
- MUST NOT use raw HTML injection with untrusted input.
- MUST NOT embed secrets, private credentials, or privileged service tokens in frontend bundles.
- MUST NOT rely on hidden UI elements as authorization.
- MUST NOT disable CSP, sanitization, or browser security controls merely to unblock implementation.

## SHOULD
- Prefer secure defaults for cookies, headers, cross-origin access, and external links where controlled by the application stack.
- Prefer short-lived client credentials and server-mediated privileged operations.

## Exceptions
Security-control exceptions require threat analysis, evidence, compensating controls, explicit approval, and a review date.

## Verification
Use security review, dependency scanning, bundle inspection, CSP/configuration inspection, penetration testing for high-risk flows, and tests around untrusted content.