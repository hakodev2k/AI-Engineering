# CORS and Browser Security Rules

## Purpose
Prevent browser-facing API configuration from unintentionally expanding trusted origins or credential exposure.

## Scope
CORS, cookies, browser credentials, preflight behavior, and cross-origin API access.

## MUST
- Define allowed origins explicitly when credentials or sensitive responses are involved.
- Evaluate cookie attributes, CSRF exposure, and browser credential behavior for state-changing operations.
- Keep cross-origin permissions limited to required methods, headers, and origins.
- Test browser security behavior in deployed configuration.

## MUST NOT
- Reflect arbitrary Origin values while allowing credentials.
- Treat CORS as an authentication or authorization mechanism.
- Disable CSRF protections for cookie-authenticated state changes without an equivalent control.

## SHOULD
- Prefer token and origin designs that minimize ambient browser authority where appropriate.

## Exceptions
Broad public-origin access is acceptable only for intentionally public resources with no credential-dependent confidentiality.

## Verification
Inspect response headers, cookie attributes, preflight behavior, CSRF tests, and cross-origin negative tests.