# HTTP Semantics Rules

## Purpose
Ensure HTTP APIs behave predictably for clients, intermediaries, caches, and operators.

## Scope
HTTP endpoints, methods, status codes, headers, caching behavior, and content negotiation.

## MUST
- HTTP methods MUST match operation semantics, including safety and idempotency expectations.
- Status codes MUST reflect actual outcomes rather than application convenience.
- Cacheable responses MUST define safe cache behavior and invalidation assumptions.
- Conditional requests and concurrency controls MUST be used where lost updates are a material risk.

## MUST NOT
- MUST NOT return success status codes for failed operations merely to simplify clients.
- MUST NOT use GET for state-changing operations.
- MUST NOT cache authenticated or sensitive responses without explicit safeguards.

## SHOULD
- APIs SHOULD support standard headers and media types where ecosystem compatibility benefits.
- Idempotent operations SHOULD tolerate safe retries.

## Exceptions
Nonstandard behavior requires documented rationale, consumer impact analysis, and tests that lock the behavior.

## Verification
Inspect route definitions, integration tests, cache headers, retry behavior, and API documentation.