# Browser Security Rules

## Purpose
Prevent frontend code from weakening application security or exposing sensitive data.

## Scope
XSS, CSRF, authentication state, browser storage, URLs, third-party scripts, and security headers relevant to Vue applications.

## MUST
- Untrusted HTML MUST be escaped by default and sanitized with an approved strategy before intentional HTML rendering.
- Authentication and authorization decisions with security impact MUST be enforced by trusted server-side controls.
- Sensitive data MUST be minimized in browser storage, logs, analytics, URLs, and error surfaces.
- State-changing requests MUST follow the application's CSRF protection model where cookie authentication is used.
- Third-party scripts and packages with privileged browser access MUST be risk-reviewed before adoption.

## MUST NOT
- Secrets, private keys, service credentials, or privileged API tokens MUST NOT be embedded in frontend bundles.
- Security controls MUST NOT be disabled to bypass integration problems without explicit approved risk acceptance.
- Client-side hiding of UI MUST NOT be presented as authorization.

## SHOULD
- Use secure cookie-based or otherwise approved token handling appropriate to the architecture.
- Support CSP and other defense-in-depth browser controls without unnecessary unsafe directives.

## Exceptions
Public identifiers and intentionally public configuration may be bundled when classified as non-secret.

## Verification
Use security review, dependency scanning, bundle inspection, browser tests, CSP reports, and targeted XSS/CSRF testing.