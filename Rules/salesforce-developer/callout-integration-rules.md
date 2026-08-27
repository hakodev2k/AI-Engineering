# Callout and Integration Rules

## Purpose
Make external integrations resilient, secure, and contract-aware.

## Scope
Applies to HTTP callouts, SOAP/REST integrations, named credentials, middleware connections, and provider adapters.

## MUST
- External calls MUST define timeouts, retry eligibility, idempotency expectations, and failure mapping.
- Provider-specific behavior MUST be isolated behind explicit integration boundaries.
- Request and response contracts MUST be validated before business state is changed.
- Integration failures MUST preserve correlation identifiers and actionable diagnostics without exposing secrets.

## MUST NOT
- MUST NOT retry non-idempotent operations blindly.
- MUST NOT couple core business logic directly to provider-specific payloads when an adapter can isolate the dependency.
- MUST NOT treat HTTP success alone as proof of business success.

## SHOULD
- Circuit-breaking or throttling behavior SHOULD be implemented outside Salesforce when platform constraints make it more reliable.
- Contract changes SHOULD be tested against realistic provider fixtures.

## Exceptions
Exceptions require documented provider constraints and failure handling.

## Verification
Use integration tests, mock callouts, contract tests, timeout/failure tests, and log review.