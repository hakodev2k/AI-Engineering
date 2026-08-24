# Networking and API Rules

## Purpose
Make remote integrations correct, resilient, observable, and compatible.

## Scope
URLSession, HTTP APIs, web services, uploads, downloads, retries, and transport models.

## MUST
- Requests MUST define timeout, cancellation, authentication, validation, and error-mapping behavior.
- HTTP status and response bodies MUST be validated before data is trusted.
- Retries MUST be limited to safe/retriable failures and use bounded backoff with jitter where appropriate.
- Contract changes MUST preserve compatibility or include an explicit migration/versioning plan.
- Sensitive request and response data MUST be redacted from diagnostics.

## MUST NOT
- MUST NOT retry non-idempotent operations blindly.
- MUST NOT treat transport success as business success.
- MUST NOT disable TLS validation or trust arbitrary certificates to unblock development.
- MUST NOT parse undocumented response assumptions without defensive validation.

## SHOULD
- Centralize transport policy while keeping feature contracts narrow.
- Support offline and degraded behavior where product requirements justify it.
- Record latency and failure categories without collecting sensitive payloads.

## Exceptions
Protocol deviations require documented server constraints, risk, compensating controls, and tests.

## Verification
Use contract/integration tests, mocked failure cases, network inspection, cancellation tests, retry assertions, and security review of TLS and logging.