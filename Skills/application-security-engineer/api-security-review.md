# API Security Review

## Purpose
Assess APIs for broken access control, unsafe data exposure, abuse, injection, and operational weaknesses.

## When to use
Use before publishing APIs, after major contract changes, for partner integrations, or when investigating API abuse.

## Inputs
OpenAPI/schema, routes, auth policies, rate limits, validation, logs, deployment config, and tests.

## Context to inspect
Inspect public and undocumented endpoints, versioning, object identifiers, pagination, bulk operations, webhooks, error responses, and gateway behavior.

## Core knowledge
API security combines object/function authorization, schema enforcement, resource controls, safe errors, inventory, and abuse resistance. Gateway controls do not replace application policy.

## Procedure
1. Inventory endpoints, methods, versions, consumers, and exposure.
2. Classify data and privileged operations.
3. Test authentication and object/function authorization.
4. Validate request schemas, content types, sizes, and unexpected fields.
5. Review response minimization and sensitive fields.
6. Test pagination, filtering, bulk operations, and expensive queries for abuse.
7. Review rate limiting, quotas, idempotency, and replay handling.
8. Inspect CORS, caching, error responses, and security headers where relevant.
9. Review deprecated endpoints and shadow APIs.
10. Add contract and abuse-case regression tests.

## Decision points
Rate limits should reflect business abuse and resource cost, not arbitrary numbers. Expose opaque identifiers only when they improve usability; never treat unpredictability as authorization.

## Common failure patterns
BOLA/IDOR, mass assignment, unlimited exports, verbose errors, stale versions, and inconsistent gateway/application policy.

## Verification
Exercise negative authorization tests, malformed schemas, resource-exhaustion bounds, and response-data checks.

## Expected output
Prioritized API findings, remediation, and reproducible verification evidence.

## Stop conditions
Escalate on active exploitation, unknown external consumers blocking safe changes, or critical authorization ambiguity.