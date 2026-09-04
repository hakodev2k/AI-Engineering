# HTTP Semantics Rules

## Purpose
Ensure HTTP APIs use protocol semantics consistently so clients, intermediaries, caches, and operators can reason about behavior.

## Scope
Applies to HTTP-based APIs.

## MUST
- HTTP methods MUST match their documented safety and idempotency semantics.
- Success and failure status codes MUST reflect the actual outcome category.
- Cache-related headers MUST reflect whether responses are cacheable and under what constraints.
- Conditional requests MUST use standard precondition mechanisms when concurrency protection depends on entity state.
- Redirects, content negotiation, and range behavior MUST be documented when supported.

## MUST NOT
- A successful status MUST NOT be returned for a request that failed semantically unless the contract explicitly models asynchronous acceptance.
- GET requests MUST NOT cause externally observable destructive state changes.
- Protocol metadata MUST NOT be repurposed with incompatible meanings.

## SHOULD
- Standard HTTP capabilities SHOULD be preferred over custom transport conventions when semantics match.
- APIs SHOULD expose retry-relevant information for transient failures where useful.

## Exceptions
Exceptions require interoperability rationale, documented client behavior, risks, and review by an API governance owner.

## Verification
Run contract tests against method, status, cache, conditional-request, and content-negotiation behavior. Inspect representative traffic and specification definitions for semantic consistency.