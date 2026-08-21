# API Security Rules

## Purpose
Protect service interfaces from unauthorized access, abuse, data exposure, and contract-level security failures.

## Scope
Applies to REST, GraphQL, RPC, webhook, and internal/external service APIs.

## MUST
- APIs MUST authenticate callers when protected resources or operations require identity.
- Authorization MUST be evaluated for the specific resource and action, not only at route level.
- Request size, rate, and complexity controls MUST exist where abuse could affect availability or cost.
- Sensitive response fields MUST be minimized and filtered according to caller permissions.
- Webhooks and machine-to-machine callbacks MUST verify authenticity and replay resistance where applicable.

## MUST NOT
- MUST NOT trust object identifiers supplied by clients as proof of ownership.
- MUST NOT expose internal-only fields merely because the caller is authenticated.
- MUST NOT rely on obscurity of endpoints for protection.

## SHOULD
- Prefer explicit API schemas and consistent security requirements.
- Prefer idempotency controls for retryable sensitive operations.

## Exceptions
Exceptions require documented exposure analysis, compensating controls, security approval, and verification.

## Verification
Use contract tests, authorization tests, API security testing, rate-limit checks, logging review, and manual assessment of sensitive flows.