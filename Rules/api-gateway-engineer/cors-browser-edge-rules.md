# CORS and Browser Edge Policy

## Purpose
Prevent browser-facing gateway policy from weakening origin boundaries.

## Scope
CORS, preflight handling, allowed origins, methods, headers, and credentials.

## MUST
- Allowed origins, methods, headers, and credential behavior MUST be explicit for sensitive APIs.
- Credentialed cross-origin access MUST use specific trusted origins rather than unrestricted origin policy.
- Preflight behavior MUST be tested against actual route authorization requirements.
- Origin policy changes MUST be reviewed for data exposure impact.

## MUST NOT
- MUST NOT use permissive CORS as a generic fix for frontend integration errors.
- MUST NOT reflect arbitrary origins when credentials or sensitive data are involved.
- MUST NOT assume CORS is an authorization control.

## SHOULD
- Policies SHOULD be minimal per API surface.
- Browser-specific edge behavior SHOULD be covered by automated integration tests.

## Exceptions
Exceptions require documented consumer need, threat assessment, bounded exposure, and security approval when sensitive access is affected.

## Verification
Inspect response headers, run browser/preflight tests from allowed and disallowed origins, and verify authentication and authorization independently.