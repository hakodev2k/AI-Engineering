# REST API Security Review

## Purpose
Perform a structured Senior-level security review of REST APIs across transport, identity, authorization, data exposure, input handling, abuse resistance, errors, and operational controls.

## When to use
Use before production launch, during major endpoint changes, security reviews, incident follow-up, third-party exposure, or modernization of legacy REST services.

## Inputs
OpenAPI contract, route inventory, authentication/authorization design, code, deployment topology, gateway configuration, tests, logs, data classification, threat model.

## Preconditions
Understand the API’s consumers, trust boundaries, protected assets, and business-critical operations.

## Context to inspect
HTTP methods and semantics, path/resource design, status codes, headers, redirects, pagination, filters, content types, versioning, gateway behavior, middleware, data access, caching, and telemetry.

## Core knowledge
Security reviews should prioritize broken authorization, excessive data exposure, unsafe state changes, injection, resource exhaustion, weak identity, replay, SSRF, mass assignment, and business-flow abuse. HTTP semantics matter: caches, redirects, content negotiation, and idempotency can alter security behavior.

## Procedure
1. Inventory endpoints and classify sensitivity.
2. Verify transport and host assumptions.
3. Review authentication per caller type.
4. Test object- and function-level authorization.
5. Check request models and validation boundaries.
6. Review response minimization and error handling.
7. Evaluate idempotency and replay for state-changing operations.
8. Inspect pagination, filtering, sorting, and batch limits.
9. Review CORS/CSRF when browsers are involved.
10. Test rate limits and resource exhaustion defenses.
11. Inspect logs, traces, and alerting for sensitive operations.
12. Record findings by exploitability, impact, evidence, and remediation priority.

## Decision points
Prioritize exploitable authorization and data-boundary failures over cosmetic hardening. Accept residual risk only with evidence, ownership, expiration, and compensating controls.

## Common failure patterns
Checklist-only reviews, testing happy paths only, relying on hidden URLs, missing alternate versions, treating HTTPS as sufficient security, and documenting findings without verification criteria.

## Verification
Retest every remediated high-risk finding and confirm regression tests exist. Compare deployed routes against the reviewed inventory.

## Expected output
A prioritized API security assessment with evidence, remediation actions, verification steps, and explicit residual-risk decisions.

## Stop conditions
Escalate when production topology differs from reviewed architecture, required test access is unavailable, or a critical finding cannot be mitigated before exposure.