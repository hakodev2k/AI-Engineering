# Browser Security Rules

## Purpose
Prevent browser automation from weakening application security or exposing privileged execution capabilities.

## Scope
Applies to browser launch flags, TLS handling, permissions, downloads, clipboard access, cross-origin controls, extensions, credentials, and untrusted content.

## MUST
- Browser security controls disabled for a test environment MUST be explicitly scoped, documented, and prevented from propagating to production automation.
- Untrusted pages and downloads MUST be treated as hostile input.
- Browser permissions such as camera, microphone, geolocation, clipboard, and notifications MUST be granted only when required by the scenario.
- Automation infrastructure MUST use least-privilege identities and protect remote browser endpoints from unauthorized access.
- Security-sensitive workflows MUST verify the relevant protection rather than only the happy path.

## MUST NOT
- TLS validation, same-origin protections, authentication, or authorization controls MUST NOT be disabled in production to unblock automation.
- Remote debugging endpoints MUST NOT be exposed publicly without strong authentication and network restriction.
- Secrets MUST NOT be injected into page-visible JavaScript state unless the application contract requires it and exposure is accepted.

## SHOULD
- Browser launch arguments SHOULD use secure defaults and be reviewed when changed.
- Security regression scenarios SHOULD cover access-denied and cross-origin boundaries appropriate to the application.

## Exceptions
Any weakened security control requires documented necessity, environment boundary, expiration, compensating controls, and human approval from the accountable owner.

## Verification
Inspect launch flags, permissions, network exposure, environment configuration, security tests, and secret scans. Confirm production profiles do not inherit test-only bypasses.