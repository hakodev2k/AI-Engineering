# Navigation and Deep Link Rules

## Purpose
Protect navigation correctness and prevent untrusted intents or links from bypassing application controls.

## Scope
Applies to internal navigation, app links, deep links, intents, exported entry points, and navigation arguments.

## MUST
- Treat all externally supplied navigation arguments as untrusted input and validate them before use.
- Re-check authentication and authorization at the destination for protected actions.
- Define back-stack behavior for externally entered flows and interrupted journeys.
- Use verified app links or equivalent trusted association for sensitive web-to-app routing where supported.

## MUST NOT
- Assume a user reached a screen through the intended prior screen.
- Put secrets, reusable credentials, or unnecessarily sensitive data in URLs or navigation arguments.
- Execute destructive or privileged actions solely from an incoming link without explicit validation and user/authorization controls.

## SHOULD
- Keep route contracts typed and centrally discoverable.
- Test cold-start, warm-start, invalid-argument, unauthenticated, and nested navigation scenarios.

## Exceptions
Legacy routes require a compatibility plan and equivalent validation controls.

## Verification
Inspect manifest/export settings, link verification, route parsers, authorization checks, and automated deep-link/navigation tests.