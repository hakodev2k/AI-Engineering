# HTTP Protocol Rules

## Purpose
Preserve correct HTTP semantics while exploiting modern transport capabilities.

## Scope
Applies to HTTP versions, methods, headers, compression negotiation, range requests, redirects, and edge protocol transformations.

## MUST
- CDN behavior MUST preserve application-visible HTTP semantics unless an intentional transformation is documented.
- Method allowlists MUST match actual application requirements.
- Hop-by-hop and forwarding headers MUST be handled according to protocol semantics and trust boundaries.
- HTTP/2 or HTTP/3 enablement MUST be validated with representative clients and observability.
- Range and conditional requests MUST be tested for large or resumable objects when supported.

## MUST NOT
- MUST NOT forward untrusted client headers as authoritative origin identity metadata.
- MUST NOT rewrite status codes or redirects in ways that conceal origin failures without explicit design.
- MUST NOT enable protocol features solely on theoretical performance claims.

## SHOULD
- Prefer modern protocols when measured client and network conditions benefit.
- Normalize only headers whose semantic equivalence is proven.
- Keep protocol transformations minimal and documented.

## Exceptions
Any semantic transformation requires rationale, compatibility evidence, affected endpoints, rollback, and service-owner approval.

## Verification
Use protocol-level tests across methods and versions; inspect request/response headers at edge and origin; validate redirects, conditional/range responses, and transport error metrics.